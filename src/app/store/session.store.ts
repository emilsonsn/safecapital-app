import { SessionState } from '@models/session';
import { Injectable } from "@angular/core";
import { Store, StoreConfig, akitaConfig } from "@datorama/akita";

export function createInitialState(): SessionState {
	return {
		isAuthenticated: false,
		user: null,
		isMaster : false
	};
}

akitaConfig({
	resettable: true
})

@Injectable({
	providedIn: 'root'
})
@StoreConfig({ name: 'sessionState' })
export class SessionStore extends Store<SessionState> {
	constructor() {
		super(createInitialState());
	}

	clearSession(): void {
		this._setState(state => createInitialState());
	}
}
