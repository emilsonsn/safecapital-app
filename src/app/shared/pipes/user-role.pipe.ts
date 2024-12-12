import { Pipe, PipeTransform } from '@angular/core';
import { PaymentForm } from '@models/application';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case 'Admin':
        return 'Administrador';
      case 'Manager':
        return 'Colaborador';

      default:
        return value;
    }
  }

}
