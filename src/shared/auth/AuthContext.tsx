import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchProfile, logoutRefreshToken } from './api';
import { AuthContext, type AuthContextValue } from './authContextValue';
import { AUTH_LOGOUT_EVENT } from './events';
import { tokenStorage } from './tokenStorage';
import type { AuthProviderType, AuthSession, AuthUser } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [activeProvider, setActiveProviderState] = useState<AuthProviderType | null>(() =>
    tokenStorage.getActiveProvider(),
  );
  const [availableProviders, setAvailableProviders] = useState<AuthProviderType[]>(() =>
    tokenStorage.getAvailableProviders(),
  );
  const [user, setUser] = useState<AuthUser | null>(() => tokenStorage.read()?.user ?? null);

  const refreshState = useCallback(() => {
    const currentProvider = tokenStorage.getActiveProvider();
    setActiveProviderState(currentProvider);
    setAvailableProviders(tokenStorage.getAvailableProviders());
    setUser(tokenStorage.read()?.user ?? null);
  }, []);

  const setSession = useCallback((session: AuthSession, provider?: AuthProviderType) => {
    tokenStorage.write(session, provider);
    refreshState();
  }, [refreshState]);

  const switchProvider = useCallback(
    async (provider: AuthProviderType) => {
      tokenStorage.setActiveProvider(provider);
      const cachedUser = tokenStorage.readUser();
      if (cachedUser) {
        setUser(cachedUser);
      }
      const token = tokenStorage.readAccessToken();
      if (token) {
        try {
          const profile = await fetchProfile(token);
          tokenStorage.writeUser(profile, provider);
          setUser(profile);
        } catch {
          /* keep cached user if network fails */
        }
      } else {
        setUser(null);
      }
      setActiveProviderState(provider);
      setAvailableProviders(tokenStorage.getAvailableProviders());
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.readRefreshToken();
    if (refreshToken) {
      await logoutRefreshToken(refreshToken);
    }
    tokenStorage.clear();
    refreshState();
  }, [refreshState]);

  useEffect(() => {
    const handler = () => {
      refreshState();
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, handler);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
  }, [refreshState]);

  useEffect(() => {
    const token = tokenStorage.readAccessToken();
    if (token && !user) {
      fetchProfile(token)
        .then((profile) => {
          tokenStorage.writeUser(profile);
          setUser(profile);
        })
        .catch(() => {
          /* Token may be expired or invalid */
        });
    }
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      activeProvider,
      availableProviders,
      setSession,
      switchProvider,
      logout,
    }),
    [user, activeProvider, availableProviders, setSession, switchProvider, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

