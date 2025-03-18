import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDateDirective } from './mask-date.directive';

const components = [MaskDateDirective];

@NgModule({
  declarations: [components],
  imports: [CommonModule],
  exports: [components],
})
export class DirectivesModule {}
