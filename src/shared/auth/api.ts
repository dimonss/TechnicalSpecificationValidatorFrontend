import axios from 'axios';
import { env } from '@/shared/config/env';
import type {
  AuthSession,
  AuthUser,
  GoogleAuthPayload,
  TelegramAuthPayload,
  TokenPair,
} from './types';

const authClient = axios.create({
  baseURL: env.authApiBaseUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

export const loginWithTelegram = async (
  payload: TelegramAuthPayload,
): Promise<AuthSession> => {
  const { data } = await authClient.post<AuthSession>('/auth/telegram', payload);
  return data;
};

export const loginWithGoogle = async (
  payload: GoogleAuthPayload,
): Promise<AuthSession> => {
  const { data } = await authClient.post<AuthSession>('/auth/google', payload);
  return data;
};

export const refreshTokens = async (refreshToken: string): Promise<TokenPair> => {
  const { data } = await authClient.post<TokenPair>('/auth/refresh', { refreshToken });
  return data;
};

export const logoutRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await authClient.post('/auth/logout', { refreshToken });
  } catch {
    /* best-effort */
  }
};

export const fetchProfile = async (accessToken: string): Promise<AuthUser> => {
  const { data } = await authClient.get<AuthUser>('/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};
