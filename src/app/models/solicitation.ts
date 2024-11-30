export interface Solicitation {
  id;
  contract_number: string;
  subject: string;
  status : SolicitationStatusEnum;
  messages?;
  user_id?;
}

export enum SolicitationStatusEnum {
  Open = 'Open',
  Closed = 'Closed'
}
