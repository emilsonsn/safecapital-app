import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@shared/components/components.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogPartnerComponent } from './dialog-partner/dialog-partner.component';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatRippleModule } from '@angular/material/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DialogClientComponent } from './dialog-client/dialog-client.component';
import { TablesModule } from '@shared/tables/tables.module';
import { MatIcon } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DialogPartnerAnalysisComponent } from './dialog-partner-analysis/dialog-partner-analysis.component';
import { DialogSolicitationComponent } from './dialog-solicitation/dialog-solicitation.component';
import { DialogFirstAccessComponent } from './dialog-first-access/dialog-first-access.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogClientContractsComponent } from './dialog-client-contracts/dialog-client-contracts.component';
import { DialogSettingComponent } from './dialog-setting/dialog-setting.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogOccurrenceComponent } from './dialog-occurrence/dialog-occurrence.component';

@NgModule({
  declarations: [
    DialogConfirmComponent,
    DialogPartnerComponent,
    DialogClientComponent,
    DialogPartnerAnalysisComponent,
    DialogSolicitationComponent,
    DialogFirstAccessComponent,
    DialogUserComponent,
    DialogClientContractsComponent,
    DialogSettingComponent,
    DialogOccurrenceComponent,
  ],
  imports: [
    CommonModule,
    TablesModule,
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
    MatTabsModule,
    TextFieldModule,
    CdkTextareaAutosize,
    CurrencyMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMatSelectSearchModule,
    MatIcon,
  ],
})
export class DialogsModule {}
