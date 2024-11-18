import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, map, of} from 'rxjs';
import { environment } from '@env/environment';
import { Auth } from '@models/auth';
import { InterceptorSkipHeader } from './auth-interceptor.service';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly _http: HttpClient,
    private readonly router: Router
  ) { }

  login(auth: Auth): Observable<any> {
    return this._http.post<any>(`${environment.api}/login`, auth, {
      headers: new HttpHeaders().set(InterceptorSkipHeader, '')
    });
  }

  logout(): Observable<any> {
    this._http.post<any>(`${environment.api}/logout`, {}).subscribe(
      () => {
        this.router.navigate(['/login']).then();
      }
    );

    return of(null);
  }

  isAuthenticated(): Observable<any> {
    return this._http.get<any>(`${environment.api}/validateToken`)
      .pipe(map(res => res.success));
  }
}
