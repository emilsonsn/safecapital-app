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
import {SharedModule} from "@shared/shared.module";
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import { TablePartnersComponent } from './table-partners/table-partners.component';
import { CardsSolicitationComponent } from './cards-solicitation/cards-solicitation.component';

const tables = [
  TableClientComponent,
  TableUserComponent,
  TablePartnersComponent,
  CardsSolicitationComponent,
]

@NgModule({
  declarations: [
    tables
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
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
