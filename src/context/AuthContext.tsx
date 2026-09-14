import React, { useState, useCallback } from 'react';
import type { LoginRequest } from '../types/api';
import { AuthContext } from './AuthContextInstance';
import { apiLogin } from '../api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vert_auth') === 'true';
  });
  const [username, setUsername] = useState<string | null>(() => {
    return sessionStorage.getItem('vert_user') || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await apiLogin(credentials);
      setIsAuthenticated(true);
      setUsername(credentials.username);
      sessionStorage.setItem('vert_auth', 'true');
      sessionStorage.setItem('vert_user', credentials.username);
    } catch (err: any) {
      const msg = err?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.';
      setAuthError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem('vert_auth');
    sessionStorage.removeItem('vert_user');
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        isLoading,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
