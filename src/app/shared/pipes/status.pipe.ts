import { Pipe, PipeTransform } from '@angular/core';
import { ClientStatus } from '@models/client';
import { SolicitationCategoryEnum, SolicitationStatusEnum } from '@models/solicitation';
import { Status } from '@models/status';
import { StatusUser } from '@models/user';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value) {
    switch (value) {
      case StatusUser.Pending.toString():
      case Status.Pending.toString():
        return 'Pendente';
      case Status.Resolved.toString():
        return 'Resolvido';
      case Status.RequestFinance.toString():
        return 'Solicitado ao financeiro';
      case Status.RequestManager.toString():
        return 'Solicitado ao gerente'
      case Status.Finished.toString():
        return 'Finalizado';
      case StatusUser.Refused.toString():
      case Status.Rejected.toString():
        return 'Rejeitado';
      case StatusUser.Return.toString():
        return 'Retorno';
      case Status.Payment.toString():
        return 'Pagamento';
      case Status.Reimbursement.toString():
        return 'Reembolso';
      case StatusUser.Accepted.toString():
        return 'Aceito';
      case SolicitationStatusEnum.Received.toString():
        return 'Recebido';
      case SolicitationStatusEnum.UnderAnalysis.toString():
        return 'Em análise';
      case SolicitationStatusEnum.Awaiting.toString():
        return 'Aguardando';
      case SolicitationStatusEnum.PaymentProvisioned.toString():
        return 'Pagamento provisionado';
      case SolicitationStatusEnum.Completed.toString():
        return 'Finalizado';
      case ClientStatus.Active.toString():
        return 'Ativo';
      case ClientStatus.Approved.toString():
        return 'Aprovado';
      case ClientStatus.Disapproved.toString():
        return 'Reprovado';
      case ClientStatus.WaitingContract.toString():
        return 'Aguardando Contrato';
      case ClientStatus.WaitingPayment.toString():
        return 'Aguardando Pagamento';
      case ClientStatus.WaitingPolicy.toString():
        return 'Aguardando Apólice';
      case ClientStatus.WaitingAnalysis.toString():
        return 'Aguardando Análise do Contrato';
      case ClientStatus.Inactive.toString():
        return 'Inativo'
      case SolicitationCategoryEnum.CommissionBonus.toString():
        return 'Comissão e Bônus';
      case SolicitationCategoryEnum.Marketing.toString():
        return 'Marketing';
      case SolicitationCategoryEnum.Legal.toString():
        return 'Jurídico';
      case SolicitationCategoryEnum.Default.toString():
        return 'Inadimplência';
      case SolicitationCategoryEnum.SuggestionsImprovements.toString():
        return 'Sugestões/Melhorias';
      case SolicitationCategoryEnum.WarrantyUpdate.toString():
        return 'Atualização da Garantia';
      case SolicitationCategoryEnum.ProposalContract.toString():
        return 'Proposta ou Contrato';

      default:
        return 'Não encontrado';
    }
  }

}
