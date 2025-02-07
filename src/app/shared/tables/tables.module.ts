import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconButton } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TableClientComponent } from './table-client/table-client.component';
import { TableUserComponent } from './table-users/table-users.component';
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import { TablePartnersComponent } from './table-partners/table-partners.component';
import { CardsSolicitationComponent } from './cards-solicitation/cards-solicitation.component';
import { TableSettingsComponent } from './table-settings/table-settings.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardsSolicitationDefaulterComponent } from './cards-solicitation-defaulter/cards-solicitation-defaulter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const tables = [
  TableClientComponent,
  TableUserComponent,
  TablePartnersComponent,
  TableSettingsComponent,
  CardsSolicitationComponent,
  CardsSolicitationDefaulterComponent
]

@NgModule({
  declarations: [
    tables
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconButton,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    PipesModule,
    AvatarModule,
  ],
  exports: [
    tables
  ],
})
export class TablesModule { }
