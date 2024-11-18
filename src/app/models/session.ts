import { User } from "./user";

export interface SessionState {
	isAuthenticated: boolean;
	user: User;
	token?: string;
	isMaster?: boolean;
}
