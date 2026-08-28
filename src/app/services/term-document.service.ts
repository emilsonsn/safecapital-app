import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@models/application';
import { TermDocument } from '@models/term-document';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TermDocumentService {
  private readonly endpoint = 'term';

  constructor(private readonly _http: HttpClient) {}

  public getCurrent(): Observable<ApiResponse<TermDocument>> {
    return this._http.get<ApiResponse<TermDocument>>(
      `${environment.api}/${this.endpoint}/current`
    );
  }

  public store(document: FormData): Observable<ApiResponse<TermDocument>> {
    return this._http.post<ApiResponse<TermDocument>>(
      `${environment.api}/${this.endpoint}`,
      document
    );
  }
}
