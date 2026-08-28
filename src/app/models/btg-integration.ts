export type BtgConnectionStatus = 'CONNECTED' | 'EXPIRED' | 'ERROR' | 'REVOKED' | 'DISCONNECTED';

export interface BtgIntegration {
  provider: 'BTG'; environment: 'SANDBOX' | 'PRODUCTION'; connection_status: BtgConnectionStatus;
  company_id: string | null; account_id: string | null; account_branch: string | null;
  account_number: string | null; scopes: string[]; authorized_at: string | null;
  access_token_expires_at: string | null; refresh_token_expires_at: string | null;
  last_refreshed_at: string | null; last_error: string | null;
}
