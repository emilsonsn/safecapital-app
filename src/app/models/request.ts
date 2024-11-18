export interface Request {
  id?: string;
  order_id : number,
  solicitation_type : RequestType,
  total_value : number,
  supplier_id : number,
  user_id : number,
  construction_id : number,
  status : RequestStatus,
  payment_date : string,
  createdAt?: string;
}

export enum RequestStatus {
  Finished = 'Finished',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

export enum RequestType {
  Payment = 'Payment',
  Reimbursement = 'Reimbursement'
}
