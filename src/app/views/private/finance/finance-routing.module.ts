import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceClientsComponent } from './finance-clients/finance-clients.component';
import { ClientInvoicesComponent } from './client-invoices/client-invoices.component';
const routes:Routes=[{path:'',component:FinanceClientsComponent},{path:'clients/:userId/invoices',component:ClientInvoicesComponent}];
@NgModule({imports:[RouterModule.forChild(routes)],exports:[RouterModule]}) export class FinanceRoutingModule {}
