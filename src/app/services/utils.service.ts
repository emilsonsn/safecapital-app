import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponsePageable } from '@models/application';
import { CEP } from '@models/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private readonly ibgeAPI = "https://servicodados.ibge.gov.br/api/v1/";

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getAddressByCep(address: string): Observable<CEP> {
    return this._http.get<CEP>(`https://viacep.com.br/ws/${address}/json`);
  }

  public obterCidadesPorEstado(uf: string): Observable<any> {
    return this._http.get<any>(`${this.ibgeAPI}/localidades/estados/${uf}/distritos/`);
  }

}
