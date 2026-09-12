import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import {
  AdminInvoice,
  FinanceClient,
  InvoiceListResponse,
  InvoiceStatus,
  ManualPaymentPayload,
  PagedData,
} from '@models/admin-finance';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminFinanceService {
  private readonly endpoint = `${environment.api}/admin/finance/clients`;
  constructor(private readonly http: HttpClient) {}
  closeBatch(date?: string): Observable<ApiResponse<{ created: number }>> {
    return this.http.post<ApiResponse<{ created: number }>>(
      `${environment.api}/admin/finance/close`,
      date ? { date } : {},
    );
  }
  clients(
    search: string,
    page: number,
    perPage: number,
  ): Observable<ApiResponse<PagedData<FinanceClient>>> {
    return this.http.get<ApiResponse<PagedData<FinanceClient>>>(this.endpoint, {
      params: new HttpParams()
        .set('search', search)
        .set('page', page)
        .set('per_page', perPage),
    });
  }
  invoices(
    userId: number,
    filters: {
      status?: string;
      due_from?: string;
      due_to?: string;
      page: number;
      per_page: number;
    },
  ): Observable<InvoiceListResponse> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('per_page', filters.per_page);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.due_from) params = params.set('due_from', filters.due_from);
    if (filters.due_to) params = params.set('due_to', filters.due_to);
    return this.http.get<InvoiceListResponse>(
      `${this.endpoint}/${userId}/invoices`,
      { params },
    );
  }
  markAsPaid(
    userId: number,
    invoiceId: number,
    payload: ManualPaymentPayload,
  ): Observable<ApiResponse<AdminInvoice>> {
    return this.http.patch<ApiResponse<AdminInvoice>>(
      `${this.endpoint}/${userId}/invoices/${invoiceId}/mark-as-paid`,
      payload,
    );
  }
  updateStatus(
    userId: number,
    invoiceId: number,
    status: Exclude<InvoiceStatus, 'PAID'>,
  ): Observable<ApiResponse<AdminInvoice>> {
    return this.http.patch<ApiResponse<AdminInvoice>>(
      `${this.endpoint}/${userId}/invoices/${invoiceId}/status`,
      { status },
    );
  }
  uploadProof(
    userId: number,
    invoiceId: number,
    file: File,
  ): Observable<ApiResponse<AdminInvoice>> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<AdminInvoice>>(
      `${this.endpoint}/${userId}/invoices/${invoiceId}/upload-proof`,
      form,
    );
  }
}
