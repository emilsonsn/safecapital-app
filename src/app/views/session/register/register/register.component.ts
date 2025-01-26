import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { Utils } from '@shared/utils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';
import { User } from '@models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Input()
  public userData?: User = null;

  // Utils
  public loading: boolean = false;
  public utils = Utils;
  protected isSuccess: boolean = true;

  // Form
  public form: FormGroup;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this._fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      cnpj: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      company_name: [null, [Validators.required]],
      creci: [null, [Validators.required]],
    });

    if (this.userData) {
      this.getUserMe();
    }
  }

  public onSubmit(): void {
    if (
      !this.form.valid ||
      this.loading ||
      (!this.filesFromBack && this.filesToSend.some((file) => !file.description))
    ) {
      this.form.markAllAsTouched();
      return;
    }

    if(!this.userData) {
      if (!this.filesToSend || this.filesToSend.length === 0) {
        this._toastr.error('Nenhum arquivo foi enviado!');
        return;
      }
    }

    if(this.filesToSend) {
      if (this.filesToSend.some((file) => !file.description)) {
        this._toastr.error('Preencha a descrição!');
        return;
      }
    }

    this._initOrStopLoading();

    if (!this.userData) {
      this.post();
    } else {
      this.removeFiles();
      this.patch();
    }
  }

  private post() {
    this._userService
      .post(this.prepareFormData({ ...this.form.getRawValue() }))
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.isSuccess = true;
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  private patch() {
    this._userService
      .patch(
        this.userData.id,
        this.prepareFormData({ ...this.form.getRawValue() })
      )
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this._toastr.success(res.message);
          this.isSuccess = true;
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
  }

  protected prepareFormData(form) {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    this.filesToSend.map((file, index) => {
      formData.append(`attachments[${index}][category]`, file.description);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    formData.append('role', 'Client');

    return formData;
  }

  // Files
  protected selectedFiles: File[] = [];
  protected filesToSend: {
    id: number;
    preview: string;
    file: File;
    fileName: string;
    description: string;
  }[] = [];

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number;
    id: number;
    description: string;
    fileName: string;
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
          fileName: file.name,
          description: null,
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

  protected removeFiles() {
    for(let idFile of this.filesToRemove) {
      // this._initOrStopLoading();

      this._userService.deleteAttachment(idFile)
        .pipe(finalize(() => {
          // this._initOrStopLoading();
        }))
        .subscribe({
          next: (res) => {},
          error : (err) => {
            this._toastr.error(`Erro ao deletar arquivo ID ${idFile}! - ${err}`);
          }
        })
    }

  }

  // Getters
  private getUserMe() {
    this._initOrStopLoading();

    this._userService.getUser()
      .pipe(finalize(() => {
        this._initOrStopLoading();
      }))
      .subscribe({
        next: (res) => {
          this.form.patchValue(res.data);
          res.data?.attachments.forEach((fileFromBack, index) => {
            this.filesFromBack[index] = {
              index: index,
              id: fileFromBack.id,
              path: fileFromBack.path,
              fileName: fileFromBack.filename,
              description: fileFromBack.description
            };
          });
        },
        error : (err) => {
          this._toastr.error(err.error.error);
        }
      })
  }

  // Utils
  private _initOrStopLoading(): void {
    this.loading = !this.loading;
  }

  public onCancel(): void {
    this._router.navigate(['/login']);
  }

  protected isValidDateFormat(value: string): boolean {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
  }
}
