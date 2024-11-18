import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide: boolean = true;
  private user;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    private readonly _sessionService : SessionService,
    private readonly _sessionQuery : SessionQuery
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  togglePasswordVisibility() {
    this.hide = !this.hide; // Alterna a visibilidade da senha
  }

  getEmailErrorMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'Você deve inserir um email';
    }
    return this.loginForm.get('email')?.hasError('email') ? 'Email inválido' : '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Você deve inserir uma senha';
    }
    return this.loginForm.get('password')?.hasError('minlength') ? 'A senha deve ter no mínimo 6 caracteres' : '';
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      await this._sessionService.login(email, password);

      await lastValueFrom(this._sessionService.getUserFromBack());

      this._sessionQuery.user$.subscribe((user) => {
        this.user = user;
      });

      if(this.user?.company_position?.position === 'Requester')
        this._router.navigate(['/painel/orders']);
      else
        this._router.navigate(['/painel/home']);
    }
  }

  options: AnimationOptions = {
    path: '/assets/json/login_animation.json',
  };
}
