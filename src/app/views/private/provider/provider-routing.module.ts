import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProviderComponent} from "@app/views/private/provider/provider/provider.component";

const routes: Routes = [
  {
    path: '',
    component: ProviderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
