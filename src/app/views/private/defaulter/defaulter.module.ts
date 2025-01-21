import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaulterRoutingModule } from './defaulter-routing.module';
import { DefaulterComponent } from './defaulter/defaulter.component';

import { SharedModule } from '@shared/shared.module';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DefaulterManagerComponent } from './defaulter-manager/defaulter-manager.component';
import { DefaulterClientComponent } from './defaulter-client/defaulter-client.component';

@NgModule({
  declarations: [DefaulterComponent, DefaulterManagerComponent, DefaulterClientComponent],
  imports: [
    CommonModule,
    DefaulterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRippleModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
  ],
})
export class DefaulterModule {}
