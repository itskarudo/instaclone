export interface AccessTokenPayload {
  username: string;
  profilePicURL: string | null;
}

export interface RefreshTokenPayload {
  username: string;
  tokenVersion: number;
}
