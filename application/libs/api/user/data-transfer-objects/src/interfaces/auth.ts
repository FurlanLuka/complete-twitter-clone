export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface TokenResponse {
  token: string;
  exp: number;
  refreshToken: string;
}
