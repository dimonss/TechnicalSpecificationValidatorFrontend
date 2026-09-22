import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchProfile, logoutRefreshToken } from './api';
import { AuthContext, type AuthContextValue } from './authContextValue';
import { AUTH_LOGOUT_EVENT } from './events';
import { tokenStorage } from './tokenStorage';
import type { AuthSession, AuthUser } from './types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => tokenStorage.read()?.user ?? null);

  const setSession = useCallback((session: AuthSession) => {
    tokenStorage.write(session);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.readRefreshToken();
    if (refreshToken) {
      await logoutRefreshToken(refreshToken);
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener(AUTH_LOGOUT_EVENT, handler);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
  }, []);

  useEffect(() => {
    const token = tokenStorage.readAccessToken();
    if (token && !user) {
      fetchProfile(token)
        .then((profile) => {
          const refreshToken = tokenStorage.readRefreshToken() || '';
          tokenStorage.write({ accessToken: token, refreshToken, user: profile });
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
      setSession,
      logout,
    }),
    [user, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
