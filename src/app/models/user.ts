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
  attachments: Attachment[];
  validation : StatusUser;
  justification? : string;
  created_at?: string;
  updated_at?: string;
}

export enum StatusUser {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Refused = 'Refused',
}

interface Attachment {
  category: string;
  file: File | string;
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
