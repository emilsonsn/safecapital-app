import { PagedData } from '@models/admin-finance';

export interface Promotion {
  id: number;
  title: string | null;
  text: string | null;
  image_path: string | null;
  image_url: string | null;
  active: boolean;
  order: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface PromotionListResponse {
  status: boolean;
  data: PagedData<Promotion>;
}

export interface ActivePromotionsResponse {
  status: boolean;
  data: Promotion[];
}

export interface PromotionPayload {
  title?: string;
  text?: string;
  active?: boolean;
  image?: File;
}
