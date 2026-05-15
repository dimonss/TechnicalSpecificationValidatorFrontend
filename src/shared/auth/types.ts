export interface AuthUser {
  id: string;
  telegramId: string | null;
  googleId: string | null;
  email: string | null;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession extends TokenPair {
  user: AuthUser;
}

export interface TelegramAuthPayload {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface GoogleAuthPayload {
  idToken: string;
}
