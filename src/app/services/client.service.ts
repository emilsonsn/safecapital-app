import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PageControl, ApiResponsePageable, ApiResponse, DeleteApiResponse } from '@models/application';
import { Client, ClientAnalysisContract, ClientPolicy, ClientPolicyDocument } from '@models/client';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private sessionEndpoint: string = 'client';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Client>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Client>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public post(client: Client | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/create`, client);
  }

  public sendMail(data: any): Observable<ApiResponse<any>> {
    return this._http.post<ApiResponse<any>>(`${environment.api}/${this.sessionEndpoint}/send-message`, data);
  }

  public patch(id: number, client: Client | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, client);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  // Attachments
  public deleteAttachment(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/attachment/${id}`);
  }

  // Policy
  public patchPolicy(id: number, client: ClientPolicy | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/policy/${id}?_method=PATCH`, client);
  }

  public deletePolicy(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/policy/${id}`);
  }

  public acceptClient(client_id : number): Observable<ApiResponse<Client>> {
    return this._http.patch<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/accept/${client_id}`, {});
  }

  //

  public createPolicyDocument(data: ClientPolicyDocument | FormData): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/policy-document`, data);
  }

  public analysisContract(id: number,data: ClientAnalysisContract): Observable<ApiResponse<Client>> {
    return this._http.post<ApiResponse<Client>>(`${environment.api}/${this.sessionEndpoint}/${id}/contract/analisys`, data);
  }

}



