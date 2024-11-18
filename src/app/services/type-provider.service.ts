import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { SupplierType } from '@models/supplier';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeProviderService {

  private sessionEndpoint: string = 'supplier/type';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getTypes(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<SupplierType>> {
      const paginate = Utils.mountPageControl(pageControl);
      const filterParams = Utils.mountPageControl(filters);

      return this._http.get<ApiResponsePageable<SupplierType>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getTypeProviderById(id : number) : Observable<ApiResponse<SupplierType>> {
    return this._http.get<ApiResponse<SupplierType>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public postTypeProvider(typeProvider: SupplierType | FormData): Observable<ApiResponse<SupplierType>> {
      return this._http.post<ApiResponse<SupplierType>>(`${environment.api}/${this.sessionEndpoint}/create`, typeProvider);
  }

  public deleteTypeProvider(id: number): Observable<DeleteApiResponse> {
      return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public patchTypeProvider(id: number, typeProvider: SupplierType | FormData): Observable<ApiResponse<SupplierType>> {
      return this._http.post<ApiResponse<SupplierType>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, typeProvider);
  }
}
