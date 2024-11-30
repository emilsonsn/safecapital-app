export interface Solicitation {
  id;
  contract_number: string;
  subject: string;
  status : "Open" | "Closed";
  messages;
  user_id;
}
