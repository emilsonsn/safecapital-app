import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './solicitation-routing.module';
import { SolicitationComponent } from './solicitation/solicitation.component';
import { SharedModule } from '@shared/shared.module';

import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SolicitationChatComponent } from './solicitation-chat/solicitation-chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [SolicitationComponent, SolicitationChatComponent],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatRippleModule,
    MatBottomSheetModule,
  ],
})
export class SolicitationModule {}
