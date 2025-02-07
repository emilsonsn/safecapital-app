import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '@services/user.service';
import { Utils } from '@shared/utils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { User } from '@models/user';
import { FileUniqueProps } from '@shared/components/file-unique-upload/file-unique-upload.component';

export enum RequiredFilesEnum {
  RG = 'RG',
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  CONTRATOSOCIAL = 'CONTRATOSOCIAL',
  CRECIPJ = 'CRECIPJ',
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Input()
  public userData?: User = null;

  @Input()
  public email?: string = '';

  // Utils
  public loading: boolean = false;
  public utils = Utils;
  protected isSuccess: boolean = false;
  protected getPassword: boolean = true;
  protected requiredFilesEnum = RequiredFilesEnum;

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
      password: [null, [Validators.required]],
      confirm_password: [null, [Validators.required]],
    });

    this.form.get('email').disable();

    if (this.userData) {
      this.getUserMe();
      this.form.get('password').clearValidators();
      this.form.get('confirm_password').clearValidators();
      this.getPassword = false;
    }

    if (this.email) {
      this.form.get('email').setValue(this.email);
    }

    this.requiredFiles = Object.values(RequiredFilesEnum).map((category) => ({
      id: 0,
      preview: '',
      file: null,
      file_name: '',
      category,
    }));
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    if (
      (this.filesToSend && this.filesToSend.some((file) => !file.category)) ||
      (this.filesFromBack && this.filesFromBack.some((file) => !file.category))
    ) {
      this._toastr.error('Preencha a categoria!');
      return;
    }

    if (
      this.filesToSend.some((file) => file.category == 'RG') ||
      this.filesFromBack.some((file) => file.category == 'RG')
    ) {
      this._toastr.error('Categoria não permitida!');
      return;
    }

    if (
      this.form.get('password').value != this.form.get('confirm_password').value
    ) {
      this._toastr.error('Senhas não coincidem');
      this.form.get('password').markAllAsTouched();
      this.form.get('confirm_password').markAllAsTouched();
      return;
    }

    if (!this.userData) {
      if (!this.requiredFiles || !this.filesToSend) {
        this._toastr.error('Nenhum arquivo foi enviado!');
        return;
      }
    }

    if (this.filesToSend) {
      if (this.filesToSend.some((file) => !file.category)) {
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
          this._toastr.success('Verifique seu email');
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
      formData.append(key, value?.toString());
    });

    this.filesToSend.map((file, index) => {
      formData.append(`attachments[${index}][category]`, file.category);
      formData.append(`attachments[${index}][file]`, file.file);
    });

    this.requiredFilesToUpdate.map((file, index) => {
      formData.append(`attachments[${index + this.filesToSend?.length}][category]`, file.category);
      formData.append(`attachments[${index + this.filesToSend?.length}][file]`, file.file);
    });

    formData.append('role', 'Client');

    return formData;
  }

  // Files
  protected filesToSend: {
    id: number;
    preview: string;
    file: File;
    fileName: string;
    category: string;
  }[] = [];

  protected requiredFiles: FileUniqueProps[] = [];
  protected requiredFilesToUpdate: FileUniqueProps[] = [];

  protected filesFromBack: {
    index: number;
    id: number;
    category: string;
    fileName: string;
    path: string;
  }[] = [];

  protected filesToRemove: number[] = [];

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

  public openFileInAnotherTab(e, isToCreateObjectUrl : boolean) {
    let fileUrl : string;
    if(isToCreateObjectUrl) fileUrl = URL.createObjectURL(e);
    else fileUrl = e;

    window.open(fileUrl, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  protected removeFiles() {
    for (let idFile of this.filesToRemove) {
      // this._initOrStopLoading();

      this._userService
        .deleteAttachment(idFile)
        .pipe(
          finalize(() => {
            // this._initOrStopLoading();
          })
        )
        .subscribe({
          next: (res) => {},
          error: (err) => {
            this._toastr.error(
              `Erro ao deletar arquivo ID ${idFile}! - ${err}`
            );
          },
        });
    }
  }

  protected addRequiredFile(index: number, file: FileUniqueProps) {
    if (index >= 0 && index < this.requiredFiles.length) this.requiredFilesToUpdate.push(file);
    else console.error(`Índice inválido: ${index}. O índice deve estar entre 0 e ${this.requiredFiles.length - 1}.`);
  }

  protected deleteRequiredFile(index: number, file: FileUniqueProps) {
    if(file?.id) this.filesToRemove.push(file.id);
  }

  // Getters
  private getUserMe() {
    this._initOrStopLoading();

    this._userService
      .getUser()
      .pipe(
        finalize(() => {
          this._initOrStopLoading();
        })
      )
      .subscribe({
        next: (res) => {
          this.form.patchValue(res.data);
          res.data?.attachments.forEach((fileFromBack, index) => {
            if (Object.values(RequiredFilesEnum).includes(this.requiredFilesEnum[fileFromBack?.category])) {
              const index = this.requiredFiles.findIndex((file) => file.category == fileFromBack.category);

              if (index != -1) {
                this.requiredFiles[index] = {
                  id: fileFromBack.id,
                  preview: fileFromBack.path,
                  file: null,
                  file_name: fileFromBack.filename,
                  category: fileFromBack.category,
                };
              }
            } else {
              this.filesFromBack.push({
                index: this.filesFromBack.length,
                id: fileFromBack.id,
                path: fileFromBack.path,
                fileName: fileFromBack.filename,
                category: fileFromBack.category,
              });
            }
          });
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        },
      });
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
