import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PageControl, ApiResponsePageable, ApiResponse, DeleteApiResponse } from '@models/application';
import { Client } from '@models/client';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getClients(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Client>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Client>>(`${environment.api}/client/search?${paginate}${filterParams}`);
  }

  public postClient(client: Client | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/client/create`, client);
  }

  public patchClient(id: number, client: Client | FormData | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/client/${id}?_method=PATCH`, client);
  }

  public deleteClient(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/client/${id}`);
  }

}



