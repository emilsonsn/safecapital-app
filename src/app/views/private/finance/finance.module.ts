import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceClientsComponent } from './finance-clients/finance-clients.component';
import { ClientInvoicesComponent } from './client-invoices/client-invoices.component';
import { ManualPaymentDialogComponent } from './manual-payment-dialog/manual-payment-dialog.component';
import { SuppliersComponent } from './suppliers/suppliers.component';import { ExpensesComponent } from './expenses/expenses.component';import { RecoverablesComponent } from './recoverables/recoverables.component';import { FinancialReportsComponent } from './financial-reports/financial-reports.component';import { CashflowFormDialogComponent } from './cashflow-form-dialog/cashflow-form-dialog.component';import { CashflowResolveDialogComponent } from './cashflow-resolve-dialog/cashflow-resolve-dialog.component';import { ReportExportComponent } from './report-export/report-export.component';
@NgModule({declarations:[FinanceClientsComponent,ClientInvoicesComponent,ManualPaymentDialogComponent,SuppliersComponent,ExpensesComponent,RecoverablesComponent,FinancialReportsComponent,CashflowFormDialogComponent,CashflowResolveDialogComponent,ReportExportComponent],imports:[CommonModule,FormsModule,ReactiveFormsModule,SharedModule,FinanceRoutingModule,MatDialogModule,MatPaginatorModule,MatProgressSpinnerModule,MatTooltipModule]}) export class FinanceModule {}
