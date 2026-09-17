import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import {
  Promotion,
  PromotionListResponse,
  PromotionPayload,
} from '@models/promotion';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminPromotionService {
  private readonly endpoint = `${environment.api}/admin/promotions`;
  constructor(private readonly http: HttpClient) {}

  list(page: number, perPage: number): Observable<PromotionListResponse> {
    const params = new HttpParams().set('page', page).set('per_page', perPage);
    return this.http.get<PromotionListResponse>(this.endpoint, { params });
  }

  create(payload: PromotionPayload): Observable<ApiResponse<Promotion>> {
    return this.http.post<ApiResponse<Promotion>>(
      this.endpoint,
      this.toFormData(payload),
    );
  }

  update(
    id: number,
    payload: PromotionPayload,
  ): Observable<ApiResponse<Promotion>> {
    return this.http.post<ApiResponse<Promotion>>(
      `${this.endpoint}/${id}`,
      this.toFormData(payload),
    );
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.endpoint}/${id}`);
  }

  reorder(ids: number[]): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.endpoint}/reorder`, {
      ids,
    });
  }

  private toFormData(payload: PromotionPayload): FormData {
    const form = new FormData();
    if (payload.title !== undefined) form.append('title', payload.title);
    if (payload.text !== undefined) form.append('text', payload.text);
    if (payload.active !== undefined)
      form.append('active', payload.active ? '1' : '0');
    if (payload.image) form.append('image', payload.image);
    return form;
  }
}
