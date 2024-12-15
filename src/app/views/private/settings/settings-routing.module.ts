import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditComponent } from './credit/credit.component';
import { TaxComponent } from './tax/tax.component';

const routes: Routes = [
  {
    path: 'credit',
    component: CreditComponent,
  },
  {
    path: 'tax',
    component: TaxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
