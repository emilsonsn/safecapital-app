import { ClientStatus } from "./client";

export interface Settings {
  id?: number;
  description: string;
  start_score: number;
  end_score: number;
  has_pending_issues: boolean;
  status: ClientStatus;
}
