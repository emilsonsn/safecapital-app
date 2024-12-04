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
  status : ClientStatus;
  contracts? : ClientContract[];
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientContract {
  category: string;
  attachment : File | string;
}

export enum ClientStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Disapproved = 'Disapproved',
}
