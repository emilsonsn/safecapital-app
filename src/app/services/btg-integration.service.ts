import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import { BtgIntegration } from '@models/btg-integration';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BtgIntegrationService {
  private readonly endpoint = `${environment.api}/admin/integrations/btg`;
  constructor(private readonly http: HttpClient) {}
  get(): Observable<ApiResponse<BtgIntegration | null>> { return this.http.get<ApiResponse<BtgIntegration | null>>(this.endpoint); }
  connect(): Observable<ApiResponse<{ authorization_url: string }>> { return this.http.post<ApiResponse<{ authorization_url: string }>>(`${this.endpoint}/connect`, {}); }
  refresh(): Observable<ApiResponse<never>> { return this.http.post<ApiResponse<never>>(`${this.endpoint}/refresh`, {}); }
  disconnect(): Observable<ApiResponse<never>> { return this.http.delete<ApiResponse<never>>(this.endpoint); }
}
