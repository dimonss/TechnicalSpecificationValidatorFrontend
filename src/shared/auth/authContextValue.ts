import { createContext } from 'react';
import type { AuthSession, AuthUser } from './types';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
