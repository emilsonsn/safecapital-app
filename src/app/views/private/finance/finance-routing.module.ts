import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceClientsComponent } from './finance-clients/finance-clients.component';
import { ClientInvoicesComponent } from './client-invoices/client-invoices.component';
import { SuppliersComponent } from './suppliers/suppliers.component';import { ExpensesComponent } from './expenses/expenses.component';import { RecoverablesComponent } from './recoverables/recoverables.component';import { FinancialReportsComponent } from './financial-reports/financial-reports.component';import { ReportExportComponent } from './report-export/report-export.component';
const routes:Routes=[{path:'',redirectTo:'reports',pathMatch:'full'},{path:'invoices',component:FinanceClientsComponent},{path:'clients/:userId/invoices',component:ClientInvoicesComponent},{path:'suppliers',component:SuppliersComponent},{path:'expenses',component:ExpensesComponent},{path:'recoverables',component:RecoverablesComponent},{path:'reports',component:FinancialReportsComponent},{path:'report-export',component:ReportExportComponent}];
@NgModule({imports:[RouterModule.forChild(routes)],exports:[RouterModule]}) export class FinanceRoutingModule {}
