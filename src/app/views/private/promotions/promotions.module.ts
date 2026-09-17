import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions.component';
import { PromotionFormDialogComponent } from './promotion-form-dialog/promotion-form-dialog.component';

@NgModule({
  declarations: [PromotionsComponent, PromotionFormDialogComponent],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PromotionsRoutingModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class PromotionsModule {}
