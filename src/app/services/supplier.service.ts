import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Supplier } from '@models/supplier';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private sessionEndpoint: string = 'supplier';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getSuppliers(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Supplier>> {

    return this._http.get<ApiResponsePageable<Supplier>>(`${environment.api}/${this.sessionEndpoint}/search`);
  }

  public postSupplier(supplier: Supplier): Observable<ApiResponse<Supplier>> {
    return this._http.post<ApiResponse<Supplier>>(`${environment.api}/${this.sessionEndpoint}/create`, supplier);
  }

  public patchSupplier(id: number, supplier: Supplier): Observable<ApiResponse<Supplier>> {
    return this._http.patch<ApiResponse<Supplier>>(`${environment.api}/${this.sessionEndpoint}/${id}`, supplier);
  }

  public deleteSupplier(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

}


