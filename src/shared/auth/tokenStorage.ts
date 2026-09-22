import type { AuthSession, TokenPair } from './types';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'tsv.user';

export const tokenStorage = {
  read(): AuthSession | null {
    try {
      const accessToken = localStorage.getItem(ACCESS_KEY);
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      if (!accessToken || !refreshToken || !userJson) return null;
      const user = JSON.parse(userJson) as AuthSession['user'];
      return { accessToken, refreshToken, user };
    } catch {
      return null;
    }
  },

  write(session: AuthSession): void {
    localStorage.setItem(ACCESS_KEY, session.accessToken);
    localStorage.setItem(REFRESH_KEY, session.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  },

  writeTokens(tokens: TokenPair): void {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },

  readAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },

  readRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
