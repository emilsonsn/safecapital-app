import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ActivePromotionsResponse } from '@models/promotion';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly endpoint = `${environment.api}/promotions`;
  constructor(private readonly http: HttpClient) {}

  listActive(): Observable<ActivePromotionsResponse> {
    return this.http.get<ActivePromotionsResponse>(this.endpoint);
  }
}
