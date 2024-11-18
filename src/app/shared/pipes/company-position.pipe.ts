import { Pipe, PipeTransform } from '@angular/core';
import { Positions, UserPosition } from '@models/user';

@Pipe({
  name: 'companyPosition'
})
export class CompanyPositionPipe implements PipeTransform {

  transform(value: Positions) {
    switch (value) {
      case Positions.Admin:
        return 'Administrador';
      case Positions.Financial:
        return 'Financeiro';
      case Positions.Supplies:
        return 'Gerente';
      case Positions.Requester:
        return 'Colaborador';

      default:
        return value;
    }
  }
}
