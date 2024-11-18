import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import {Banco, RequestOrder} from '@models/requestOrder';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private sessionEndpoint: string = 'order';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getOrders(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<RequestOrder>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<RequestOrder>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getOrderById(id : number) : Observable<ApiResponse<RequestOrder>> {
    return this._http.get<ApiResponse<RequestOrder>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public postOrder(order: RequestOrder | FormData): Observable<ApiResponse<RequestOrder>> {
    return this._http.post<ApiResponse<RequestOrder>>(`${environment.api}/${this.sessionEndpoint}/create`, order);
  }

  public deleteOrder(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public deleteItem(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/item/${id}`);
  }

  public deleteFile(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/file/${id}`);
  }

  public patchOrder(id: number, order: RequestOrder | FormData): Observable<ApiResponse<RequestOrder>> {
    return this._http.post<ApiResponse<RequestOrder>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, order);
  }

  public throwToGranatum(id : number): Observable<ApiResponse<RequestOrder>> {
    return this._http.post<ApiResponse<RequestOrder>>(`${environment.api}/${this.sessionEndpoint}/granatum/${id}`, {});
  }

  public getBank(): Observable<ApiResponse<Banco[]>> {
    return this._http.get<ApiResponse<Banco[]>>(`${environment.api}/${this.sessionEndpoint}/getBank`);
  }

  public getCategories(): Observable<ApiResponse<any[]>> {
    return this._http.get<ApiResponse<any[]>>(`${environment.api}/${this.sessionEndpoint}/getCategories`);
  }

}
