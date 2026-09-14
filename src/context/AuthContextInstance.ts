import { createContext } from 'react';
import type { LoginRequest } from '../types/api';

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
