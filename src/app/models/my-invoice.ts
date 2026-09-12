import { AdminInvoice, PagedData } from '@models/admin-finance';

export interface MyInvoiceListResponse {
  status: boolean;
  data: PagedData<AdminInvoice>;
}
