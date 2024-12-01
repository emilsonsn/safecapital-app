export interface Solicitation {
  id;
  contract_number: string;
  subject: string;
  status : SolicitationStatusEnum;
  messages?;
  user_id?;
  created_at? : string;
  updated_at? : string;
  deleted_at? : string;
}

export enum SolicitationStatusEnum {
  Open = 'Open',
  Closed = 'Closed'
}
