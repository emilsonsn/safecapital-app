import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Service, ServiceType } from '@models/service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getServices(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Service>> {

    return this._http.get<ApiResponsePageable<Service>>(`${environment.api}/service/search`);
  }

  public postService(service: Service): Observable<ApiResponse<Service>> {
    return this._http.post<ApiResponse<Service>>(`${environment.api}/service/create`, service);
  }

  public patchService(id: number, service: Service): Observable<ApiResponse<Service>> {
    return this._http.patch<ApiResponse<Service>>(`${environment.api}/service/${id}`, service);
  }

  public deleteService(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/service/${id}`);
  }

  // Type Service
  public getTypeServices(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<ServiceType>> {

    return this._http.get<ApiResponsePageable<ServiceType>>(`${environment.api}/service/type/search`);
  }

  public postTypeService(serviceType: ServiceType): Observable<ApiResponse<ServiceType>> {
    return this._http.post<ApiResponse<ServiceType>>(`${environment.api}/service/type/create`, serviceType);
  }

  public deleteTypeService(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/service/type/${id}`);
  }

}
