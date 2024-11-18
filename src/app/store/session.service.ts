import { Injectable } from "@angular/core";
import { SessionStore } from "./session.store";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { tap, map, take, mergeMap, shareReplay } from 'rxjs/operators';
import { Observable, of } from "rxjs";
import { applyTransaction, resetStores } from "@datorama/akita";
import { AuthService } from "@services/auth.service";
import { LocalStorageService } from "@services/local-storage.service";
import { User } from "@models/user";
import { UserService } from "@services/user.service";
import { SessionQuery } from "./session.query";
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	constructor(
		private readonly _sessionStore: SessionStore,
		private readonly _router: Router,
		private readonly _toastr: ToastrService,
    private readonly _authService: AuthService,
		private readonly _userService: UserService,
		private readonly _storage: LocalStorageService,
	) {

    this.getUserFromBack();
  }

  public login(email: string, password: string): Promise<any> {
    return firstValueFrom(
      this._authService.login({ email, password }).pipe(take(1))
    ).then(
      (res) => {
        this.handleLoginResponse(res);
        return res;
      },
      (error) => {
        this.handleLoginError(error);
        throw error;
      }
    );
  }

	public logout() {

		this._authService.logout()
			.pipe(take(1))
			.subscribe({
        next: () => {
          this.updateIsAuthenticated(false);
          this._router.navigate(['/login']);
        },
        error: (err) => {
        }
      });
		resetStores();
		this._storage.clear();
		this.updateIsAuthenticated(false);
		this._router.navigate(['/login']);
	}


	public handleLoginResponse(response: any): void {
    this._storage.set('name', response.name);
    this._storage.set('access_token', response.access_token);
    if(response.type === 'MASTER') {
      this._sessionStore.update({ isMaster: true });
    };
    this.updateIsAuthenticated(true);
	}

	public handleLoginError(err: any): void {
		this._toastr.warning(err.error.error);
	}

	public getUser(): Observable<User> {
    return this._sessionStore
      ._select(state => state.user)
      .pipe(
          mergeMap(user => {
              if (user) {
                  return of(user);
              }
              return this.getUserFromBack();
          })
      );
  }

  public getUserFromBack(): Observable<User> {
      return this._userService.getUser()
          .pipe(
              map(user => user.data),
              tap(user => {
                this._sessionStore.update({ user });
              }),
              shareReplay()
          )
  }

  public updateIsAuthenticated(isAuthenticated: boolean) {
    applyTransaction(() => {
      this._sessionStore.setLoading(false);
      this._sessionStore.update({ isAuthenticated });
    });
  }

  public isAuthenticated(): boolean {
    if(this._storage.get('access_token'))
      return true;
    else
      return false;
  }

}
