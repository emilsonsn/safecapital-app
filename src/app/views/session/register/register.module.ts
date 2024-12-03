import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LottieComponent } from 'ngx-lottie';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterManagerComponent } from './register-manager/register-manager.component';
import { RegisterLayoutComponent } from './register-layout/register-layout.component';
import { RegisterAutenticateComponent } from './register-autenticate/register-autenticate.component';


@NgModule({
  declarations: [
    RegisterComponent,
    RegisterManagerComponent,
    RegisterLayoutComponent,
    RegisterAutenticateComponent,
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    LottieComponent,
    NgxMaskDirective,
    NgxMaskPipe,
  ]
})
export class RegisterModule { }
