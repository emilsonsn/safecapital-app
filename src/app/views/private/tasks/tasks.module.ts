import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks/tasks.component';
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {SharedModule} from "@shared/shared.module";
import {MatRipple} from "@angular/material/core";


@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    SharedModule,
    MatRipple
  ]
})
export class TasksModule { }
