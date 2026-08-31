export interface PolicyTemplate {
  id: number;
  filename: string;
  version: string;
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}

export interface PolicyTemplateConfiguration {
  template: PolicyTemplate;
  required_variables: string[];
}
