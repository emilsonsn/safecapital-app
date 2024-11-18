import { Client } from "./client";

export interface Construction {
  id?: number;
  name: string;
  local: string;
  contractor_id: number;
  client_id: number;
  cno: number;
  description: string;

  client?: Client;
  contractor?: Client;
}
