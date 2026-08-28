import { InvoicePerson, PagedData } from './admin-finance';
export type ExpenseStatus='PENDING'|'PAID'|'CANCELLED'; export type RecoverableStatus='PENDING'|'RECOVERED'|'LOST';
export interface Supplier {id:number;name:string;tax_id:string|null;email:string|null;phone:string|null;notes:string|null;is_active:boolean;expenses_count?:number;created_at?:string;}
export interface Expense {id:number;supplier_id:number|null;category:string;description:string;amount:number;due_date:string|null;paid_at:string|null;status:ExpenseStatus;payment_reference:string|null;notes:string|null;supplier:Pick<Supplier,'id'|'name'>|null;created_by?:InvoicePerson;paid_by?:InvoicePerson|null;}
export interface RecoverableValue {id:number;reference:string;case_number:string|null;counterparty:string|null;description:string;amount:number;expected_recovery_date:string|null;received_at:string|null;resolved_at:string|null;status:RecoverableStatus;notes:string|null;created_by?:InvoicePerson;resolved_by?:InvoicePerson|null;}
export interface MonthlyFinancialReport {id:number;reference_month:string;invoice_income:number;recoveries_income:number;total_income:number;total_expenses:number;net_balance:number;recoverable_balance:number;generated_at:string;}
export type CashflowPaged<T>=PagedData<T>;
