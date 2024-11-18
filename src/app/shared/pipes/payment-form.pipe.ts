import { Pipe, PipeTransform } from '@angular/core';
import { PaymentForm } from '@models/application';

@Pipe({
  name: 'paymentForm'
})
export class PaymentFormPipe implements PipeTransform {

  transform(value: PaymentForm) {
    switch (value) {
      case PaymentForm.Cash:
        return 'À vista';
      case PaymentForm.InvoicedPaymentForecast:
        return 'Faturado';

      default:
        return value;
    }
  }

}
