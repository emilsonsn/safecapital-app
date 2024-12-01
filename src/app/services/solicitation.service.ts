import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import { Solicitation } from '@models/solicitation';
import {Utils} from '@shared/utils';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitationService {

  private sessionEndpoint: string = 'solicitation';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getList(pageControl: PageControl, filters?): Observable<ApiResponsePageable<Solicitation>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Solicitation>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getById(id : number) : Observable<ApiResponse<Solicitation>> {
    return this._http.get<ApiResponse<Solicitation>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public post(solicitation: Solicitation | FormData): Observable<ApiResponse<Solicitation>> {
    return this._http.post<ApiResponse<Solicitation>>(`${environment.api}/${this.sessionEndpoint}/create`, solicitation);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public patch(id: number, solicitation: Solicitation): Observable<ApiResponse<Solicitation>> {
    return this._http.post<ApiResponse<Solicitation>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, solicitation);
  }

}
