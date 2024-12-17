import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PageControl, ApiResponsePageable, ApiResponse, DeleteApiResponse } from '@models/application';
import { Settings } from '@models/settings';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxSettingService {

  private readonly endpoint : string = 'tax-setting';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Settings>> {
    return this._http.get<ApiResponsePageable<Settings>>(`${environment.api}/${this.endpoint}/search`);
  }

  public patch(id: number, setting: Settings): Observable<ApiResponse<Settings>> {
    return this._http.patch<ApiResponse<Settings>>(`${environment.api}/${this.endpoint}/${id}`, setting);
  }
}



