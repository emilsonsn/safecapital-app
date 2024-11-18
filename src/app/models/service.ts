export interface Service {
  id?: number;
  name: string;
  service_type_id: number;
  type: ServiceType;
}

export interface ServiceType {
  id?: number;
  type: string;
}
