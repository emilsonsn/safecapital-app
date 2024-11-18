import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "@app/views/session/login/login.component";
import {ForgotPasswordComponent} from "@app/views/session/forgot-password/forgot-password.component";
import {PasswordRecoveryComponent} from "@app/views/session/password-recovery/password-recovery.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'password_recovery',
    component: PasswordRecoveryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule {
}
