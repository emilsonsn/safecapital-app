import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { CollaboratorRoutingModule } from './collaborator-routing.module';
import { CollaboratorComponent } from './collaborator/collaborator.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '@shared/shared.module';
import {MatRipple} from "@angular/material/core";
import {MatDivider} from "@angular/material/divider";


@NgModule({
  declarations: [
    CollaboratorComponent
  ],
  imports: [
    CommonModule,
    CollaboratorRoutingModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatRipple,
    MatDivider
  ]
})
export class CollaboratorModule { }
