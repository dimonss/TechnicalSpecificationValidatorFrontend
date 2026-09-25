import type { AuthProviderType, AuthSession, AuthUser, TokenPair } from './types';

export const APP_ID = 'tsv';
const APP_PROVIDER_KEY = `${APP_ID}_auth_provider`;

export function hasTokensFor(provider: AuthProviderType): boolean {
  return !!localStorage.getItem(`${provider}_accessToken`) && !!localStorage.getItem(`${provider}_refreshToken`);
}

export function getAvailableProviders(): AuthProviderType[] {
  const list: AuthProviderType[] = [];
  if (hasTokensFor('google')) list.push('google');
  if (hasTokensFor('telegram')) list.push('telegram');
  return list;
}

export function getActiveProvider(): AuthProviderType | null {
  const hasGoogle = hasTokensFor('google');
  const hasTelegram = hasTokensFor('telegram');

  if (!hasGoogle && !hasTelegram) {
    return null;
  }
  if (hasGoogle && !hasTelegram) {
    return 'google';
  }
  if (hasTelegram && !hasGoogle) {
    return 'telegram';
  }

  const stored = localStorage.getItem(APP_PROVIDER_KEY) as AuthProviderType | null;
  if (stored === 'google' || stored === 'telegram') {
    return stored;
  }

  return 'google';
}

export function setActiveProvider(provider: AuthProviderType): void {
  localStorage.setItem(APP_PROVIDER_KEY, provider);
}

export const tokenStorage = {
  hasTokensFor,
  getAvailableProviders,
  getActiveProvider,
  setActiveProvider,

  read(): AuthSession | null {
    try {
      const provider = getActiveProvider();
      if (!provider) return null;
      const accessToken = localStorage.getItem(`${provider}_accessToken`);
      const refreshToken = localStorage.getItem(`${provider}_refreshToken`);
      const userJson = localStorage.getItem(`${provider}_user`);
      if (!accessToken || !refreshToken) return null;
      const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
      if (!user) return null;
      return { accessToken, refreshToken, user };
    } catch {
      return null;
    }
  },

  write(session: AuthSession, provider?: AuthProviderType): void {
    const targetProvider = provider || getActiveProvider() || 'google';
    localStorage.setItem(`${targetProvider}_accessToken`, session.accessToken);
    localStorage.setItem(`${targetProvider}_refreshToken`, session.refreshToken);
    localStorage.setItem(`${targetProvider}_user`, JSON.stringify(session.user));
    localStorage.setItem(APP_PROVIDER_KEY, targetProvider);
  },

  writeTokens(tokens: TokenPair, provider?: AuthProviderType): void {
    const targetProvider = provider || getActiveProvider() || 'google';
    localStorage.setItem(`${targetProvider}_accessToken`, tokens.accessToken);
    localStorage.setItem(`${targetProvider}_refreshToken`, tokens.refreshToken);
  },

  readAccessToken(): string | null {
    const provider = getActiveProvider();
    if (!provider) return null;
    return localStorage.getItem(`${provider}_accessToken`);
  },

  readRefreshToken(): string | null {
    const provider = getActiveProvider();
    if (!provider) return null;
    return localStorage.getItem(`${provider}_refreshToken`);
  },

  readUser(): AuthUser | null {
    try {
      const provider = getActiveProvider();
      if (!provider) return null;
      const userJson = localStorage.getItem(`${provider}_user`);
      return userJson ? (JSON.parse(userJson) as AuthUser) : null;
    } catch {
      return null;
    }
  },

  writeUser(user: AuthUser, provider?: AuthProviderType): void {
    const targetProvider = provider || getActiveProvider() || 'google';
    localStorage.setItem(`${targetProvider}_user`, JSON.stringify(user));
  },

  clear(provider?: AuthProviderType): void {
    const targetProvider = provider || getActiveProvider();
    if (targetProvider) {
      localStorage.removeItem(`${targetProvider}_accessToken`);
      localStorage.removeItem(`${targetProvider}_refreshToken`);
      localStorage.removeItem(`${targetProvider}_user`);
      const remaining = getActiveProvider();
      if (remaining) {
        localStorage.setItem(APP_PROVIDER_KEY, remaining);
      } else {
        localStorage.removeItem(APP_PROVIDER_KEY);
      }
    } else {
      localStorage.removeItem('google_accessToken');
      localStorage.removeItem('google_refreshToken');
      localStorage.removeItem('google_user');
      localStorage.removeItem('telegram_accessToken');
      localStorage.removeItem('telegram_refreshToken');
      localStorage.removeItem('telegram_user');
      localStorage.removeItem(APP_PROVIDER_KEY);
    }
  },

  clearAll(): void {
    localStorage.removeItem('google_accessToken');
    localStorage.removeItem('google_refreshToken');
    localStorage.removeItem('google_user');
    localStorage.removeItem('telegram_accessToken');
    localStorage.removeItem('telegram_refreshToken');
    localStorage.removeItem('telegram_user');
    localStorage.removeItem(APP_PROVIDER_KEY);
  },
};

