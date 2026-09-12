import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyInvoicesComponent } from './my-invoices.component';

const routes: Routes = [{ path: '', component: MyInvoicesComponent }];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class MyInvoicesRoutingModule {}
