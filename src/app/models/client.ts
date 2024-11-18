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
  created_at?: Date;
  updated_at?: Date;
}
