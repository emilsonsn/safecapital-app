import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaulterManagerComponent } from './defaulter-manager/defaulter-manager.component';

const routes: Routes = [
  {
    path: '',
    component: DefaulterManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaulterRoutingModule {}
