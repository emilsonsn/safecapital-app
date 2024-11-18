export interface ViaCep {
	bairro: string;
	cep: string;
	complemento: string;
	gia: string;
	ibge: string;
	localidade: string;
	logradouro: string;
	uf: string;
	unidade: string;
  erro?: boolean;
}

export interface Mask {
  guide: boolean;
  mask: (string | RegExp)[];
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PaymentForm {
  Cash = 'Cash',
  InvoicedPaymentForecast = 'InvoicedPaymentForecast',
}

export interface PageControl {
  order?: Order;
  orderField?: string;
  page?: number;
  take?: number;
  itemCount?: number;
  pageCount?: number;
  search_term?: string;
  type?: string;
}

export interface BaseEntity {
  id?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface ApiResponseBase {
  status: boolean;
  erro?: string;
  message?: string;
}

export interface DeleteApiResponse extends ApiResponseBase {
  affectedRows: number;
}

export interface AuthResponse extends ApiResponseBase {
  accessToken: string;
}

export interface ApiResponse<T> extends ApiResponseBase {
  data: T;
}

export interface ApiResponseQuery<T> extends ApiResponseBase {
  data: T[];
}

export interface ApiResponsePageable<T> extends ApiMetaPageable {
  data: T[];
}

interface ApiMetaPageable {
  current_page: number;
  per_page: number;
  path: string;
  from: number;
  to: number;
  total: number;
  last_page: number;
  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
}

export interface DDI {
  name: string;
  code: string;
  ddi: number;
}
