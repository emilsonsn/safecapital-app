export interface User {
  id?: number;
  name: string;
  phone: string;
  surname: string;
  company_name: string;
  cnpj: string;
  creci: string;
  email: string;
  password: string;
  is_active: boolean;
  role: UserRole;
  validation: StatusUser;
  terms?: boolean;
  attachments?: UserAttachment[];
  justification?: string;
  created_at?: string;
  updated_at?: string;
}

export enum StatusUser {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Return = 'Return',
  Refused = 'Refused',
}

export interface UserAttachment {
  id: number;
  user_id: number;
  category: string;
  filename: string;
  path: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Client = 'Client',
}

// Old

export interface UserPosition {
  id?: string;
  position: string;
}

export interface UserSector {
  id?: number;
  sector: string;
}

export interface UserCards {
  total: number;
  active: number;
  inactive: number;
}

export enum UserStatus {
  ATIVO = 'ACTIVE',
  INATIVO = 'INACTIVE',
  BLOQUEADO = 'BLOCKED',
}

export enum Positions { //Gerente/Gestor/Adm/Tiago
  Admin = 'Admin',
  Financial = 'Financial',
  Supplies = 'Supplies',
  Requester = 'Requester',
}
