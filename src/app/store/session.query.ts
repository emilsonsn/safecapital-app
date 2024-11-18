import { SessionState } from '@models/session';
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { SessionStore } from "./session.store";

@Injectable({
	providedIn: 'root'
})

export class SessionQuery extends Query<SessionState> {
	isAuthenticated$ = this.select(state => state.isAuthenticated);
	user$ = this.select(state => state.user);
	token$ = this.select(state => state.token);
	isMaster$ = this.select(state => state.isMaster);

	constructor(protected store: SessionStore) {
		super(store);
	}

}
