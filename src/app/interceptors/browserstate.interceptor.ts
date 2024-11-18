import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/core'

@Injectable()
export class BrowserstateInterceptor implements HttpInterceptor {

  constructor(private state: TransferState) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const storedResponse: string = this.state.get(makeStateKey(request.url), null);
    if (storedResponse) {
      return of(new HttpResponse({ body: storedResponse, status: 200 }));
    }

    return next.handle(request);
  }
}
