import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import {User, UserCards, UserPosition, UserSector, UserStatus} from '@models/user';
import {Utils} from '@shared/utils';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private sessionEndpoint: string = 'user';

  constructor(
    private readonly _http: HttpClient
  ) {
  }

  public getList(pageControl?: PageControl, filters?): Observable<ApiResponsePageable<User>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<User>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getUser(): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/me`);
  }

  public getById(id: number): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public post(user: User | FormData): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/create`, user);
  }

  public patch(id: number, user: User | FormData): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, user);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  // Cards / Info
  public getCards(): Observable<ApiResponse<UserCards>> {
    return this._http.get<ApiResponse<UserCards>>(`${environment.api}/${this.sessionEndpoint}/cards`);
  }

  // Termos de Uso
  public acceptTerms(): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this.sessionEndpoint}/accept-term`, null);
  }

  // Parceiros / Register
  public getUserByEmail(email : string): Observable<ApiResponse<User>> {
    const params = new HttpParams().set('email', email);

    return this._http.get<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/email`, {params});
  }

  public validateUser(id: number, form): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/validation/${id}?_method=PATCH`, form);
  }

  // Attachments
  public deleteAttachment(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/attachment/${id}`);
  }

  // Password
  public updatePassword(data: { code: string, password: string }): Observable<any> {
    return this._http.post<any>(`${environment.api}/updatePassword`, data);
  }

  public recoverPassword(email: string): Observable<any> {
    return this._http.post<any>(`${environment.api}/recoverPassword`, {email});
  }

  public resetPassword(token: string, password: string): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${environment.api}/open/${this.sessionEndpoint}/reset-password/${token}`, {password: password});
  }

}
