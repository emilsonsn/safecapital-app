import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionRoutingModule } from './construction-routing.module';
import { ConstructionComponent } from './construction/construction.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ConstructionComponent
  ],
  imports: [
    CommonModule,
    ConstructionRoutingModule,
    SharedModule,
    MatDialogModule,
  ]
})
export class ConstructionModule { }
