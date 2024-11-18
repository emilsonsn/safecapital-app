import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConstructionComponent} from "@app/views/private/construction/construction/construction.component";

const routes: Routes = [
  {
    path: '',
    component: ConstructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConstructionRoutingModule { }
