import { Pipe, PipeTransform } from '@angular/core';
import { RequestOrderType } from '@models/requestOrder';

@Pipe({
  name: 'requestOrderType'
})
export class RequestOrderTypePipe implements PipeTransform {

  transform(value: string | RequestOrderType) {
    switch (value) {
      case RequestOrderType.Material:
        return 'Material';
      case RequestOrderType.Order:
        return 'Despesa';
      case RequestOrderType.Reimbursement:
        return 'Reembolso';
      case RequestOrderType.Service:
        return 'Serviço';
      default:
        return value;
    }
  }

}
