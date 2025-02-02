import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountManagerComponent} from "@shared/components/account-manager/account-manager.component";
import {LottieComponent} from "ngx-lottie";
import {
  SmallInformationCardComponent
} from "@shared/components/small-information-card/small-information-card.component";
import {MatDivider, MatDividerModule} from "@angular/material/divider";
import {KanbanComponent} from "@shared/components/kanban/kanban.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import { HeaderPageComponent } from './header-page/header-page.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KanbanDefaulterComponent } from './kanban-defaulter/kanban-defaulter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientContractComponent } from './client/client-contract/client-contract.component';
import { FileUniqueUploadComponent } from './file-unique-upload/file-unique-upload.component';

const components: any[] = [
  AccountManagerComponent,
  SmallInformationCardComponent,
  KanbanComponent,
  HeaderPageComponent,
  SearchInputComponent,
  KanbanDefaulterComponent,
  ClientContractComponent,
  FileUniqueUploadComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    LottieComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatRippleModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder
  ],
  exports: components
})
export class ComponentsModule { }
