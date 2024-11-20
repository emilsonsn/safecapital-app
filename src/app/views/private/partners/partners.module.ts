import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersRoutingModule } from './partners-routing.module';
import { PartnersComponent } from './partners/partners.component';
import {SharedModule} from "@shared/shared.module";
import {MatRippleModule} from "@angular/material/core";

@NgModule({
  declarations: [
    PartnersComponent
  ],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    SharedModule,
    MatRippleModule,
  ]
})
export class PartnersModule { }
