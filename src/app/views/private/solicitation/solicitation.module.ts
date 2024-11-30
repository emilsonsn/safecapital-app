import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './solicitation-routing.module';
import { SolicitationComponent } from './solicitation/solicitation.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SolicitationComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
]
})
export class SolicitationModule { }
