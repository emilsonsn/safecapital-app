import { User } from './user';

export interface Solicitation {
  id?: number;
  contract_number: string;
  subject: string;
  status: SolicitationStatusEnum;
  messages: SolicitationMessage[];
  user?: User;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SolicitationMessage {
  id?: number;
  message: string;
  attachment: File | string;
  solicitation_id: number;
  user? : User;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum SolicitationStatusEnum {
  Open = 'Open',
  Closed = 'Closed',
}
