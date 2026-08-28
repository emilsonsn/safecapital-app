import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditComponent } from './credit/credit.component';
import { TaxComponent } from './tax/tax.component';
import { BtgIntegrationComponent } from './btg-integration/btg-integration.component';
import { adminGuard } from '@app/guards/admin.guard';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path: 'credit',
    component: CreditComponent,
  },
  {
    path: 'tax',
    component: TaxComponent,
  },
  { path: 'integrations/btg', component: BtgIntegrationComponent, canActivate: [adminGuard] },
  {
    path: 'terms',
    component: TermsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
