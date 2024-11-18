import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { RequestsComponent } from './requests/requests.component';
import { SharedModule } from '@shared/shared.module';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    RequestsComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
    MatRippleModule
  ]
})
export class RequestsModule { }
