import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SessionRoutingModule} from './session-routing.module';
import {LoginComponent} from './login/login.component';
import {SharedModule} from "@shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RegisterComponent } from './register/register.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    PasswordRecoveryComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatError,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatButton,
  ]
})
export class SessionModule {
}
