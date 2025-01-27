import { afterNextRender, Component, ElementRef, inject, Inject, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { SessionQuery } from '@store/session.query';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-dialog-partner',
  templateUrl: './dialog-partner.component.html',
  styleUrl: './dialog-partner.component.scss',
})
export class DialogPartnerComponent {

  // Utils
  protected myUser: User;
  public isNewPartner: boolean = true;
  public title: string = 'Novo ';
  public loading: boolean = false;
  public utils = Utils;

  // Form
  public form: FormGroup;
  protected canEdit: boolean = true;
  public profileImageFile: File | null = null;
  protected profileImage: string | ArrayBuffer = null;
  protected isDragOver: boolean = false;

  // Selects
  public validationSelect: { label: string; value: string }[] = [
    {
      label: 'Aceito',
      value: 'Accepted',
    },
    {
      label: 'Pendente',
      value: 'Pending',
    },
    {
      label: 'Recusado',
      value: 'Refused',
    },
  ];

  public isActiveSelect: { label: string; value: number }[] = [
    {
      label: 'Sim',
      value: 1,
    },
    {
      label: 'Não',
      value: 0,
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogPartnerComponent>,
    private readonly _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _userService: UserService,
    private readonly _toastr: ToastrService,
    private readonly _sessionQuery: SessionQuery
  ) {}

  ngOnInit(): void {
    this._sessionQuery.user$.subscribe((user) => {
      this.myUser = user;
    });

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      cnpj: [null],
      company_name: [null],
      creci: [null],
      justification: [''],
      is_active: [1],
      role: ['Client'],
      validation: ['Pending'],
    });

    if (this._data?.user) {
      this.isNewPartner = false;
      this.title = 'Editar ';

      this._data?.user?.attachments.forEach((fileFromBack, index) => {
        this.filesFromBack[index] = {
          index: index,
          id: fileFromBack.id,
          path: fileFromBack.path,
          fileName: fileFromBack.filename,
          category: fileFromBack.category
        };
      });

      this.form.patchValue(this._data.user);
    }

    this.form.get('validation').valueChanges.subscribe((value) => {
      if(['Refused', 'Pending'].includes(value)) {
        this.form.get('is_active').patchValue(0);
        this.form.get('is_active').disable();
      }
      else {
        this.form.get('is_active').enable();
        this.form.get('is_active').patchValue(this._data?.user.is_active ?? 1);
      }
    })
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid || this.loading) {
      form.markAllAsTouched();
      this._toastr.error('Preencha todos os campos!');
      return;
    }

    if (this.isNewPartner) {
      if (!this.filesToSend || this.filesToSend.length === 0) {
        this._toastr.error('Nenhum arquivo foi enviado!');
        return;
      }
    }

    if(this.filesToSend) {
      if (this.filesToSend.some((file) => !file.category)) {
        this._toastr.error('Preencha a descrição do arquivo!');
        return;
      }
    }

    const formData = new FormData();

    Object.entries(form.controls).forEach(([key, control]) => {
      formData.append(key, control.value);
    });

    this.filesToSend.map((file, index) => {
      formData.append(`attachments[${index}][category]`, file.category);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    if (this.isNewPartner) {
      this.post(formData);
    } else {
      this.patch(formData);
    }
  }

  protected patch(partner : FormData) {
    this._initOrStopLoading();
    const id = +partner.get('id');
    this._userService
      .patch(id, partner)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected post(partner : FormData) {
    this._initOrStopLoading();

    this._userService
      .post(partner)
      .pipe(finalize(() => this._initOrStopLoading()))
      .subscribe({
        next: (res) => {
          if (res.status) {
            this._toastr.success(res.message);
            this._dialogRef.close(true);
          }
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  // Files
  protected selectedFiles: File[] = [];
  protected filesToSend: {
    id: number;
    preview: string;
    filename: string;
    file: File;
    category: string;
  }[] = [];

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number;
    id: number;
    fileName: string;
    category: string;
    path: string;
  }[] = [];

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ];

  @ViewChild('filesInput') fileInput!: ElementRef;

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.filesToSend.push({
          id: this.filesToSend.length + 1,
          preview: base64,
          file: file,
          filename: file.name,
          category: null,
        });
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
      this.fileInput.nativeElement.value = '';
    }
  }

  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  // Utils
  public onCancel(): void {
    this._dialogRef.close();
  }

  protected _initOrStopLoading() {
    this.loading = !this.loading;
  }

  // Imports
  // TextArea
  private _injector = inject(Injector);

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      }
    );
  }
}
