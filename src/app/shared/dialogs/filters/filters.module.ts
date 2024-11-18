import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogFilterOrderComponent } from './dialog-filter-order/dialog-filter-order.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentsModule } from '@shared/components/components.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DialogFilterRequestComponent } from './dialog-filter-request/dialog-filter-request.component';

const filters = [
  DialogFilterOrderComponent,

]

@NgModule({
  declarations: [
    filters,
    DialogFilterRequestComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    ClipboardModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  exports: [
    filters
  ]
})
export class FiltersModule { }
