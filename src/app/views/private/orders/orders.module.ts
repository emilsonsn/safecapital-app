import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersComponent} from './orders/orders.component';
import {SharedModule} from '@shared/shared.module';
import {MatOption, MatRippleModule} from '@angular/material/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatSelect} from "@angular/material/select";


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    MatRippleModule,
    MatOption,
    MatLabel,
    MatSelect,
    MatFormField,
  ]
})
export class OrdersModule {
}
