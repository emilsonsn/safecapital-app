import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import { AdminInvoice } from '@models/admin-finance';
import { MyInvoiceListResponse } from '@models/my-invoice';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MyInvoiceService {
  private readonly endpoint = `${environment.api}/finance/invoices`;
  constructor(private readonly http: HttpClient) {}
  list(filters: {
    year?: number;
    page: number;
    per_page: number;
  }): Observable<MyInvoiceListResponse> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('per_page', filters.per_page);
    if (filters.year) params = params.set('year', filters.year);
    return this.http.get<MyInvoiceListResponse>(this.endpoint, { params });
  }
  uploadProof(
    invoiceId: number,
    file: File,
  ): Observable<ApiResponse<AdminInvoice>> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<ApiResponse<AdminInvoice>>(
      `${this.endpoint}/${invoiceId}/upload-proof`,
      form,
    );
  }
}
