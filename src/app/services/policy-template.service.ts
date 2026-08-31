import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import { PolicyTemplateConfiguration } from '@models/policy-template';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PolicyTemplateService {
  private readonly endpoint = 'policy-template';

  constructor(private readonly _http: HttpClient) {}

  public getCurrent(): Observable<ApiResponse<PolicyTemplateConfiguration>> {
    return this._http.get<ApiResponse<PolicyTemplateConfiguration>>(
      `${environment.api}/${this.endpoint}/current`
    );
  }

  public store(document: FormData): Observable<ApiResponse<PolicyTemplateConfiguration>> {
    return this._http.post<ApiResponse<PolicyTemplateConfiguration>>(
      `${environment.api}/${this.endpoint}`,
      document
    );
  }

  public downloadCurrent(): Observable<Blob> {
    return this._http.get(
      `${environment.api}/${this.endpoint}/current/download`,
      { responseType: 'blob' }
    );
  }
}
