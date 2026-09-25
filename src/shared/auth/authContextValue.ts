import { createContext } from 'react';
import type { AuthProviderType, AuthSession, AuthUser } from './types';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  activeProvider: AuthProviderType | null;
  availableProviders: AuthProviderType[];
  setSession: (session: AuthSession, provider?: AuthProviderType) => void;
  switchProvider: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

