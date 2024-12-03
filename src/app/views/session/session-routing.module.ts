import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "@app/views/session/login/login.component";
import {ForgotPasswordComponent} from "@app/views/session/forgot-password/forgot-password.component";
import {PasswordRecoveryComponent} from "@app/views/session/password-recovery/password-recovery.component";
import { RegisterComponent } from './register/register/register.component';

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
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
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
