import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnersRoutingModule } from './partners-routing.module';
import { PartnersComponent } from './partners/partners.component';
import {SharedModule} from "@shared/shared.module";
import {MatRippleModule} from "@angular/material/core";
import { PartnersAnalysisComponent } from './partners-analysis/partners-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PartnersComponent,
    PartnersAnalysisComponent
  ],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SharedModule,
    MatRippleModule,
  ]
})
export class PartnersModule { }
