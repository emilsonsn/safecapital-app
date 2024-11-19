import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '@services/user.service';
import dayjs from 'dayjs';
import {Utils} from '@shared/utils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
// Utils
public loading: boolean = false;
public loadingSetting : boolean = false;
public utils = Utils;
protected isSuccess: boolean = true;

// Form
public form: FormGroup;
protected confirm_password : String;
protected limit : number = 5;

// File
public profileImageFile: File | null = null;
public profileImage: string | ArrayBuffer = null;
public isDragOver: boolean = false;

constructor(
  private readonly _fb: FormBuilder,
  private readonly _userService: UserService,
  private readonly _router : Router,
  private readonly _toastr : ToastrService,
) {
  // this.getSettings();
}

ngOnInit(): void {

  this.form = this._fb.group({
    id: [null],
    name: [null, [Validators.required]],
    cpf_cnpj: [null, [Validators.required]],
    birth_date: [null, [Validators.required]],
    password: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    // whatsapp: [null, [Validators.required]],
    email: [null, [Validators.required]],
  })

  this.form.get('birth_date').valueChanges.subscribe(data => {
    const inputValue = data;
    if (this.isValidDateFormat(data)) {
      const [day, month, year] = inputValue.split('/').map(Number);
      this.form.controls['birth_date'].setValue(new Date(year, month - 1, day));
    }
  });

  this.isSuccess = false;

}

public onSubmit(): void {
  if (!this.form.valid || this.loading) {
    this.form.markAllAsTouched();
    return;
  }

  if(this.loadingSetting) return;

  if(this.form.get('password').value != this.confirm_password) {
    this._toastr.error("Senhas não coincidem!");
    return;
  }

  this._initOrStopLoading();

  this._userService.postUser(this.prepareFormData())
    .pipe(finalize(() => {
      this._initOrStopLoading();
    }))
    .subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this.isSuccess = true;
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      },
    })

}

public onCancel(): void {
  this._router.navigate(['/login']);
}

protected prepareFormData(user?) {

  const formData = new FormData();

  formData.append('id', this.form.get('id')?.value);
  formData.append('name', this.form.get('name')?.value);
  formData.append('cpf_cnpj', this.form.get('cpf_cnpj')?.value);
  formData.append('birth_date', dayjs(this.form.get('birth_date')?.value).format('YYYY-MM-DD'));
  formData.append('phone', this.form.get('phone')?.value);
  // formData.append('whatsapp', this.form.get('whatsapp')?.value);
  formData.append('email', this.form.get('email')?.value);
  formData.append('password', this.form.get('password')?.value);
  // formData.append('photo', this.profileImageFile);
  // formData.append('is_active', "1");
  // formData.append('is_admin', "0");
  // formData.append('file_limit', this.limit.toString());

  return formData;
}

// File
onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.profileImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

triggerFileInput(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}

onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragOver = true;
}

onDragLeave(event: DragEvent): void {
  this.isDragOver = false;
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragOver = false;

  const file = event.dataTransfer?.files[0];
  if (file) {
    this.profileImageFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

removeImage(event: Event): void {
  event.stopPropagation();
  this.profileImage = null;
}

// Getters

// Utils
private _initOrStopLoading(): void {
  this.loading = !this.loading;
}

private _initOrStopLoadingSetting(): void {
  this.loadingSetting = !this.loadingSetting;
}

protected goToLogin() {
  this._router.navigate(['/login']);
}

protected isValidDateFormat(value: string): boolean {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
}
}
