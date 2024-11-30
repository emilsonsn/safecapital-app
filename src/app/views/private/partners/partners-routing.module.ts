import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PartnersComponent} from "@app/views/private/partners/partners/partners.component";
import { PartnersAnalysisComponent } from './partners-analysis/partners-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: PartnersComponent
  },
  {
    path: 'analysis',
    component: PartnersAnalysisComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }
