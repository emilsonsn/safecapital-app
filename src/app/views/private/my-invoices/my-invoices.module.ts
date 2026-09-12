import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { MyInvoicesRoutingModule } from './my-invoices-routing.module';
import { MyInvoicesComponent } from './my-invoices.component';
import { InvoiceDetailDialogComponent } from './invoice-detail-dialog/invoice-detail-dialog.component';

@NgModule({
  declarations: [MyInvoicesComponent, InvoiceDetailDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MyInvoicesRoutingModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class MyInvoicesModule {}
