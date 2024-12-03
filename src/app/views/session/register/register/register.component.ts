import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
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
  protected confirm_password: String;

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
    });

    if (this.userData) {
      this.form.patchValue(this.userData);

      this.form.get('password').setValidators([]);
      this.form.removeControl('password');
    }
  }

  public onSubmit(): void {
    if (!this.form.valid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.filesToSend) {
      this._toastr.error('Anexe pelo menos um arquivo!');
      return;
    }

    if (this.form.get('password').value != this.confirm_password) {
      this._toastr.error('Senhas não coincidem!');
      return;
    }

    this._initOrStopLoading();

    this._userService
      .postUser(this.prepareFormData({ ...this.form.getRawValue() }))
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
      formData.append(`attachments[${index}]`, file.file);
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
  }[] = [];

  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
  ];

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
        });
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  public openFileInAnotherTab(e) {
    const fileUrl = URL.createObjectURL(e.file);

    window.open(fileUrl, '_blank');
  }

  // Getters

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
