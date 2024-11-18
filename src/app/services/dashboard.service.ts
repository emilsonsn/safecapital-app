import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import {Observable} from "rxjs";
import {ApiResponse} from "@models/application";
import {Request} from "@models/request";
import {OrderData} from "@models/dashboard";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private readonly _http: HttpClient
  ) {}

  getDashboardCards(): Observable<ApiResponse<OrderData>> {
    return this._http.get<ApiResponse<OrderData>>(`${environment.api}/dashboard/cards`);
  }

  getPurchaseGraphicBar() {
    return this._http.post<any>(`${environment.api}/dashboard/purchaseGraphic`, {});
  }

  getPurchaseGraphicLine() {
    return this._http.post<any>(`${environment.api}/dashboard/orderGraphic`, {});
  }

}
