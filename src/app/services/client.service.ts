import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PageControl, ApiResponsePageable, ApiResponse, DeleteApiResponse } from '@models/application';
import { Client, ClientPolicyDocument } from '@models/client';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Client>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Client>>(`${environment.api}/client/search?${paginate}${filterParams}`);
  }

  public post(client: Client | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/client/create`, client);
  }

  public patch(id: number, client: Client | FormData | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/client/${id}?_method=PATCH`, client);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/client/${id}`);
  }

  //

  public createPolicyDocument(data: ClientPolicyDocument | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/client/policy-document`, data);
  }

}



