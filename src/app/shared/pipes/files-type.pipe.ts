import { Pipe, PipeTransform } from '@angular/core';
import { RequiredFilesEnum } from '@app/views/session/register/register/register.component';
import { FilesSolicitationEnum } from '@models/solicitation';

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
      case FilesSolicitationEnum.Charge:
        return 'Cobrança';
      case FilesSolicitationEnum.CondominiumBill:
        return 'Boleto Condomínio';
      case FilesSolicitationEnum.IPTU:
        return ' IPTU';
      case FilesSolicitationEnum.OverdueBill:
        return 'Boleto Vencido';

      default:
        return value;
    }
  }

}
