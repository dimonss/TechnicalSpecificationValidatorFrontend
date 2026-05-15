import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { logoutRefreshToken } from './api';
import { AUTH_LOGOUT_EVENT } from './events';
import { tokenStorage } from './tokenStorage';
import type { AuthSession, AuthUser } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
