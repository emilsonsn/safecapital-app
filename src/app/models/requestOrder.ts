import {PaymentForm} from "./application";
import { Construction } from "./construction";
import {Supplier} from "./supplier";
import {User} from "./user";

export interface RequestOrder {
  id?: number;
  order_type: RequestOrderType;
  date: string;
  construction_id: number;
  user_id: number;
  supplier_id: number;
  quantity_items: number;
  total_value: number;
  payment_method: PaymentForm;
  purchase_status: RequestOrderStatus;
  description?: string;
  items?: Item[]
  order_files?: string[] | File[];
  approved?: OrderResponsible;
  createdAt?: string;
  supplier: Supplier;
  user: User;
  has_granatum: boolean;
  construction: Construction;
}

export interface Banco {
  id: number;
  descricao: string;
  permite_lancamento: boolean;
  ativo: boolean;
  saldo: string;
}


export interface Item {
  id?: number;
  name: string;
  quantity: number;
}

export enum RequestOrderType { // Pedido, reembolso, serviço, material...
  Order = 'Order',
  Reimbursement = 'Reimbursement',
  Service = 'Service',
  Material = 'Material'
}

export enum RequestOrderStatus { // lista suspensa) (resolvido ou solicitar financeiro)
  Pending = 'Pending',
  Resolved = 'Resolved',
  RequestFinance = 'RequestFinance',
  RequestManager = 'RequestManager'
}

export enum OrderResponsible { //Gerente/Gestor/Adm/Tiago
  MANAGER = 'MANAGER',
  GESTOR = 'GESTOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  TIAGO = 'TIAGO'
}

export interface requestCards {
  solicitationFinished: number
  solicitationPending: number
  solicitationReject: number
}
