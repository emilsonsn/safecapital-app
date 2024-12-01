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
import { SolicitationManagerComponent } from './solicitation-manager/solicitation-manager.component';
import { SolicitationClientComponent } from './solicitation-client/solicitation-client.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    SolicitationComponent,
    SolicitationChatComponent,
    SolicitationManagerComponent,
    SolicitationClientComponent,
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRippleModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatTooltipModule,
  ],
})
export class SolicitationModule {}
