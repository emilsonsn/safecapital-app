import {Request} from '@models/request';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import {Utils} from '@shared/utils';
import {Observable} from 'rxjs';
import {requestCards} from "@models/requestOrder";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private sessionEndpoint: string = 'solicitation';

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getRequests(pageControl: PageControl, filters?): Observable<ApiResponsePageable<Request>> {
      const paginate = Utils.mountPageControl(pageControl);
      const filterParams = Utils.mountPageControl(filters);

      return this._http.get<ApiResponsePageable<Request>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getRequestById(id : number) : Observable<ApiResponse<Request>> {
    return this._http.get<ApiResponse<Request>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public postRequest(request: Request | FormData): Observable<ApiResponse<Request>> {
      return this._http.post<ApiResponse<Request>>(`${environment.api}/${this.sessionEndpoint}/create`, request);
  }

  public deleteRequest(id: number): Observable<DeleteApiResponse> {
      return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public patchRequest(id: number, request: Request): Observable<ApiResponse<Request>> {
      return this._http.post<ApiResponse<Request>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, request);
  }

  getCards(): Observable<ApiResponse<requestCards>> {
    return this._http.get<any>(`${environment.api}/solicitation/cards`, {});
  }

}
