import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitationManagerComponent } from './solicitation-manager/solicitation-manager.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitationManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
