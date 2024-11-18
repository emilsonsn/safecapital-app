import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Construction } from '@models/construction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstructionService {

  private sessionEndpoint: string = 'construction';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getConstructions(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Construction>> {

    return this._http.get<ApiResponsePageable<Construction>>(`${environment.api}/${this.sessionEndpoint}/search`);
  }

  public postConstruction(construction: Construction): Observable<ApiResponse<Construction>> {
    return this._http.post<ApiResponse<Construction>>(`${environment.api}/${this.sessionEndpoint}/create`, construction);
  }

  public patchConstruction(id: number, construction: Construction): Observable<ApiResponse<Construction>> {
    return this._http.patch<ApiResponse<Construction>>(`${environment.api}/${this.sessionEndpoint}/${id}`, construction);
  }

  public deleteConstruction(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

}
