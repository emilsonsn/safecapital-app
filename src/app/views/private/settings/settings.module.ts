import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { CreditComponent } from './credit/credit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { SharedModule } from '@shared/shared.module';
import { TaxComponent } from './tax/tax.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';


@NgModule({
  declarations: [
    CreditComponent,
    TaxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ]
})
export class SettingsModule { }
