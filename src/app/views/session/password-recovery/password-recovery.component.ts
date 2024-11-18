import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "@services/user.service";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {
  options: AnimationOptions = {
    path: '/assets/json/animation_password_recovery.json',
  };
  code!: string;
  passwordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private readonly _toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private readonly _userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password').value === form.get('confirmPassword').value ? null : {passwordMismatch: true};
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const {password, confirmPassword} = this.passwordForm.value;

      if (password !== confirmPassword) {
        this._toastr.warning('As senhas não coincidem!');
        return;
      }

      // Aqui você pode enviar o código e a nova senha para o backend
      const recoveryData = {
        code: this.code,
        password: password
      };

      this._userService.updatePassword(recoveryData).subscribe(res => {
        if (res.status) {
          this.router.navigate(['/login']).then();
        }
      });
    }
  }

  onBack() {
    // Lógica para voltar à página anterior
    this.router.navigate(['/']).then();
  }

}
