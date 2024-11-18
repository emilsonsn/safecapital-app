import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpjMask'
})
export class CpfCnpjMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    let cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return value;
  }

}
