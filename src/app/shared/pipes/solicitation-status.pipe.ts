import { Pipe, PipeTransform } from '@angular/core';
import { RequestType } from '@models/request';

@Pipe({
  name: 'solicitationStatus'
})
export class SolicitationStatusPipe implements PipeTransform {

  transform(value: string | RequestType) {
    switch (value) {
      case RequestType.Payment:
        return 'Pagamento';
      case RequestType.Reimbursement:
        return 'Reembolso';
      default:
        return value;
    }
  }

}