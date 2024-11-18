import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider/provider.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";


@NgModule({
  declarations: [
    ProviderComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatRipple
  ]
})
export class ProviderModule { }
