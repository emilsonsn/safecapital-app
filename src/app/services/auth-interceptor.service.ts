import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
		private readonly _storage: LocalStorageService,
		private readonly _router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return of(this._storage.get('access_token'))
      .pipe(
        mergeMap(isAuthenticated => {
          const token = this._storage.get('access_token');
          if(isAuthenticated && token) {
            return this.setJwtOrSkip(request, next, token);
          }

          const headers = request.headers.delete(InterceptorSkipHeader);
          request = request.clone({ headers });
          return next.handle(request)
            .pipe(tap({
              error: (err) => {
                if (err instanceof HttpErrorResponse) {
                  if (err.status !== 401) {
                    return;
                  }

                  this._router.navigate(['/login']).then();
                }
              }
            }));
        })
      )
  }

  private setJwtOrSkip(request: HttpRequest<any>, next: HttpHandler, jwt: string): Observable<HttpEvent<any>> {
		if (!request.headers.has(InterceptorSkipHeader)) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${jwt}`,
				}
			});
		} else {
			const headers = request.headers.delete(InterceptorSkipHeader);
			request = request.clone({ headers });
		}
		return next.handle(request)
      .pipe(tap({
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this._router.navigate(['/login']).then();
          }
        }
      }));
	}
}
