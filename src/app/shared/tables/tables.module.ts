import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconButton } from "@angular/material/button";
import { TableOrdersComponent } from './table-orders/table-orders.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TableProviderComponent } from './table-provider/table-provider.component';
import { TableServiceComponent } from './table-service/table-service.component';
import { TableConstructionComponent } from './table-construction/table-construction.component';
import { TableClientComponent } from './table-client/table-client.component';
import { TableRequestComponent } from './table-request/table-request.component';
import { TableTypeProviderComponent } from './table-type-provider/table-type-provider.component';
import { TableTypeServiceComponent } from './table-type-service/table-type-service.component';
import { TableTypeUserSectorComponent } from './table-type-user-sector/table-type-user-sector.component';
import { TableUserComponent } from './table-users/table-users.component';
import {SharedModule} from "@shared/shared.module";
import {AvatarModule} from "@shared/components/avatar/avatar.module";

const tables = [
  TableOrdersComponent,
  TableProviderComponent,
  TableServiceComponent,
  TableClientComponent,
  TableConstructionComponent,
  TableRequestComponent,
  TableTypeProviderComponent,
  TableTypeProviderComponent,
  TableTypeServiceComponent,
  TableUserComponent,
  TableTypeUserSectorComponent,
]

@NgModule({
  declarations: [
    tables,
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
