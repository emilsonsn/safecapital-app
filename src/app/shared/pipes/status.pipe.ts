import { Pipe, PipeTransform } from '@angular/core';
import { RequestStatus } from '@models/request';
import { Status } from '@models/status';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: string | Status | RequestStatus) {
    switch (value) {
      case Status.Pending:
        return 'Pendente';
      case Status.Resolved:
        return 'Resolvido';
      case Status.RequestFinance:
        return 'Solicitado ao financeiro';
      case Status.RequestManager:
        return 'Solicitado ao gerente'
      case Status.Finished:
        return 'Finalizado';
      case Status.Rejected:
        return 'Rejeitado';
      case Status.Payment:
        return 'Pagamento';
      case Status.Reimbursement:
        return 'Reembolso';
      case 'Accepted':
        return 'Aceito';
      case 'Refused':
        return 'Rejeitado';
      case 'Received':
        return 'Recebido';
      case 'UnderAnalysis':
        return 'Em análise';
      case 'Awaiting':
        return 'Aguardando';
      case 'PaymentProvisioned':
        return 'Pagamento provisionado';
      case 'Completed':
        return 'Finalizado';
      case 'Approved':
        return 'Aprovado';
      case 'Disapproved':
        return 'Reprovado';

      default:
        return 'Não encontrado';
    }
  }

}
