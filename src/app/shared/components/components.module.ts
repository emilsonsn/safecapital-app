import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountManagerComponent} from "@shared/components/account-manager/account-manager.component";
import {LottieComponent} from "ngx-lottie";
import {
  SmallInformationCardComponent
} from "@shared/components/small-information-card/small-information-card.component";
import {MatDivider} from "@angular/material/divider";
import {KanbanComponent} from "@shared/components/kanban/kanban.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";

const components: any[] = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    LottieComponent,
    MatDivider,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder
  ],
  exports: components
})
export class ComponentsModule { }
