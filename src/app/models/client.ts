export interface Client {
  id?: number;
  name: string;
  cpf_cnpj: string;
  phone: number;
  whatsapp: number;
  email: string;
  address: string;
  city: string;
  state: string;
  status: ClientStatus;
  rental_value: number;
  property_tax: number;
  condominium_fee: number;
  policy_value: number;
  policy: ClientPolicy;
  payment_form: PaymentFormEnum;
  attachments: ClientAttachment[];
  contracts?: ClientContract[];
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientAttachment {
  id: number;
  client_id: number;
  description: string;
  filename: string;
  path: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface ClientPolicy {
  id: number;
  client_id: number;
  contract_number: string;
  due_date: string;
  filename: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface ClientContract {
  category: string;
  attachment: File | string;
}

export interface ClientPolicyDocument {
  client_id: number;
  file: File | string;
}

export enum PaymentFormEnum {
  INCASH = 'INCASH',
  INVOICED = 'INVOICED',
}

export enum ClientStatus {
  Pending = 'Pending',
  Disapproved = 'Disapproved',
  Approved = 'Approved',
  WaitingPayment = 'WaitingPayment',
  WaitingContract = 'WaitingContract',
  WaitingAnalysis = 'WaitingAnalysis',
  Active = 'Active',
  Inactive = 'Inactive',
}
