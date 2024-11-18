import {Component} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "@services/user.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  primaryBtnText: string = "Continuar";
  disablePrimaryBtn: boolean = false;
  showInput: boolean = true;
  countdown: number = 60;
  intervalId: any;

  constructor(private fb: FormBuilder, private router: Router, private readonly _userService: UserService) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.showInput = false;
      this.disablePrimaryBtn = true;

      this._userService.recoverPassword(this.emailForm.value.email).subscribe(
        {
          next: () => {
            this.startCountdown();
          },
          error: () => {
            this.showInput = true;
            this.disablePrimaryBtn = false;
          }
        }
      );
    }
  }

  onBack() {
    // Lógica para voltar à página anterior
    this.router.navigate(['login']);
  }

  startCountdown() {
    this.disablePrimaryBtn = true;
    this.primaryBtnText = `Reenviar (${this.countdown}s)`;
    this.intervalId = setInterval(() => {
      this.countdown--;
      this.primaryBtnText = `Reenviar (${this.countdown}s)`;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.disablePrimaryBtn = false;
        this.primaryBtnText = "Reenviar";
        this.countdown = 60; // Reset countdown
      }
    }, 1000);
  }

  options: AnimationOptions = {
    path: '/assets/json/animation_no_recover.json',
  };

}
