import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormPipe } from './payment-form.pipe';
import { StatusPipe } from './status.pipe';
import { PhoneMaskPipe } from './phone-mask.pipe';
import { CpfCnpjMaskPipe } from './cpf-cnpj-mask.pipe';
import { SolicitationStatusPipe } from './solicitation-status.pipe';
import { CompanyPositionPipe } from './company-position.pipe';
import { UserRolePipe } from './user-role.pipe';
import { FileTypePipe } from './files-type.pipe';

const pipes = [
  PaymentFormPipe,
  StatusPipe,
  PhoneMaskPipe,
  CpfCnpjMaskPipe,
  SolicitationStatusPipe,
  CompanyPositionPipe,
  UserRolePipe,
  FileTypePipe
];

@NgModule({
  declarations: [
    pipes,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    pipes
  ]
})
export class PipesModule { }
