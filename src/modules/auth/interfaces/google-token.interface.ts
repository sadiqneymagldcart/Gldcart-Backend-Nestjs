export interface GoogleToken {
  accessToken: string;
  id_token: string;
  expires_in: number;
  refreshToken: string;
  scope: string;
  token_type: string;
}
