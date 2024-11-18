import { Pipe, PipeTransform } from '@angular/core';
import { OrderResponsible } from '@models/requestOrder';

@Pipe({
  name: 'orderResponsible'
})
export class OrderResponsiblePipe implements PipeTransform {

  transform(value: OrderResponsible) {
    switch (value) {
      case OrderResponsible.MANAGER:
        return 'Gerente';
      case OrderResponsible.GESTOR:
        return 'Gestor';
      case OrderResponsible.ADMINISTRATOR:
        return 'Administrador';
      case OrderResponsible.TIAGO:
        return 'Tiago';
      default:
        return value;
    }
  }

}
