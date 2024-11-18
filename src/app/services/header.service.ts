import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private _title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _subTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _search: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public getTitle(): Observable<string> {
    return this._title.asObservable();
  }

  public setTitle(title: string): void {
    this._title.next(title);
  }

  public getSubTitle(): Observable<string> {
    return this._subTitle.asObservable();
  }

  public setSubTitle(title: string): void {
    this._subTitle.next(title);
  }

  public getSearch(): Observable<string> {
    return this._search.asObservable();
  }

  public setSearch(search: string): void {
    this._search.next(search);
  }

  public clearSearch(): void {
    this._search.next('');
  }

}
