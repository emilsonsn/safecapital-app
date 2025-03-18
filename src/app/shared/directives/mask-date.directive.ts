import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMaskDate]',
})
export class MaskDateDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let value = this.el.nativeElement.value;
    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    this.el.nativeElement.value = value;
  }
}
