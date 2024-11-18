export interface Supplier {
  id?: number;
  fantasy_name: string;
  cnpj: string;
  phone: number;
  whatsapp: number;
  email: string;
  address: string;
  city: string;
  state: string;
  type_supplier_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface SupplierType {
  id? : number,
  type : string
}
