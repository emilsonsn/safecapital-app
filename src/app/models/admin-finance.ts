export type InvoiceStatus = 'OPEN' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface FinanceClient { id:number; name:string; surname:string; company_name:string|null; email:string; role:'Client'; invoices_count:number; open_invoices_count:number; paid_invoices_count:number; overdue_invoices_count:number; invoices_total_amount:string|null; }
export interface InvoicePerson { id:number; name:string; surname:string; }
export interface InvoiceInstallment { id:number; client_id:number; installment_number:number; amount:number; due_date:string; status:string; paid_amount?:number|null; client?:InvoicePerson; }
export interface AdminInvoice { id:number; user_id:number; closing_date:string; due_date:string; amount:number; status:InvoiceStatus; digitable_line:string|null; boleto_url:string|null; boleto_barcode:string|null; paid_at:string|null; paid_by_user_id:number|null; payment_method:string|null; payment_reference:string|null; payment_notes:string|null; paid_by:InvoicePerson|null; installments:InvoiceInstallment[]; }
export interface FinanceClientSummary { id:number; name:string; surname:string; company_name:string|null; email:string; }
export interface PagedData<T> { current_page:number; data:T[]; per_page:number; total:number; last_page?:number; }
export interface InvoiceListResponse { status:boolean; client:FinanceClientSummary; data:PagedData<AdminInvoice>; }
export interface ManualPaymentPayload { paid_at?:string; payment_reference?:string; payment_notes?:string; }
