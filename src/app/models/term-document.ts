export interface TermDocument {
  id: number;
  filename: string;
  path?: string;
  external_url?: string;
  url: string;
  version: string;
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}
