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
export class SettingService {

  private readonly endpoint : string = 'credit-configuration';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Settings>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Settings>>(`${environment.api}/${this.endpoint}/search?${filterParams}`);
  }

  public create(setting: Settings): Observable<ApiResponse<Settings>> {
    return this._http.patch<ApiResponse<Settings>>(`${environment.api}/${this.endpoint}/create`, setting);
  }

  public patch(id: number, setting: Settings): Observable<ApiResponse<Settings>> {
    return this._http.patch<ApiResponse<Settings>>(`${environment.api}/${this.endpoint}/${id}`, setting);
  }

  public delete(id: number): Observable<ApiResponse<Settings>> {
    return this._http.delete<ApiResponse<Settings>>(`${environment.api}/${this.endpoint}/${id}`);
  }

}



