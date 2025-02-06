import { Pipe, PipeTransform } from '@angular/core';
import { RequiredFilesEnum } from '@app/views/session/register/register/register.component';

@Pipe({
  name: 'FilesType'
})
export class FileTypePipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case RequiredFilesEnum.RG:
        return 'RG';
      case RequiredFilesEnum.CNPJ:
        return 'CNPJ';
      case RequiredFilesEnum.CPF:
        return 'CPF';
      case RequiredFilesEnum.CONTRATOSOCIAL:
        return 'Contrato Social';
      case RequiredFilesEnum.CRECIPJ:
        return 'CRECI';

      default:
        return value;
    }
  }

}
