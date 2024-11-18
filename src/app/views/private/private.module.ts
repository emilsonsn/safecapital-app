import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import {HomeModule} from "@app/views/private/home/home.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    HomeModule
  ]
})
export class PrivateModule { }
