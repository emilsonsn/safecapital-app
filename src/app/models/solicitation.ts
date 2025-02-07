import { User } from './user';

export interface Solicitation {
  id?: number;
  contract_number: string;
  subject: string;
  status: SolicitationStatusEnum;
  messages: SolicitationMessage[];
  attachments: SolicitationAttachment[];
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
  user?: User;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SolicitationAttachment {
  id: number;
  solicitation_id: number;
  description: string;
  filename: string;
  path: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export enum FilesSolicitationEnum {
  OverdueBill = 'OverdueBill',
  Charge = 'Charge',
  CondominiumBill = 'CondominiumBill',
  IPTU = 'IPTU'
}

export enum SolicitationStatusEnum {
  Received = 'Received',
  UnderAnalysis = 'UnderAnalysis',
  Awaiting = 'Awaiting',
  PaymentProvisioned = 'PaymentProvisioned',
  Completed = 'Completed',
}

export enum SolicitationCategoryEnum {
  ProposalContract = 'ProposalContract',
  WarrantyUpdate = 'WarrantyUpdate',
  Default = 'Default',
  CommissionBonus = 'CommissionBonus',
  SuggestionsImprovements = 'SuggestionsImprovements',
  Marketing = 'Marketing',
  Legal = 'Legal',
}
