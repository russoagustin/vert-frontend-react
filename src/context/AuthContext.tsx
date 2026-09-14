import React, { useState, useCallback, useEffect } from 'react';
import type { LoginRequest } from '../types/api';
import { AuthContext } from './AuthContextInstance';
import { apiLogin } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';
import { formatErrorMessage } from '../api/errors';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vert_auth') === 'true';
  });
  const [username, setUsername] = useState<string | null>(() => {
    return sessionStorage.getItem('vert_user') || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
    sessionStorage.removeItem('vert_auth');
    sessionStorage.removeItem('vert_user');
  }, []);

  // Si cualquier petición administrativa protegida recibe 401 o 403 (cookie expirada/inválida), desloguear
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

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
      const msg = formatErrorMessage(err, 'Error al iniciar sesión. Verifica tus credenciales.');
      setAuthError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
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
