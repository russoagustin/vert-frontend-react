import type { LoginRequest } from '../types/api';
import { apiFetch, setBackendOffline } from './client';

export async function apiLogin(credentials: LoginRequest): Promise<void> {
  try {
    // Al resolver 200 OK, la cookie 'access_token' queda guardada en el navegador
    await apiFetch<void>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  } catch (err: any) {
    // Si el backend no está disponible, permitir login en modo DEMO
    if (err instanceof TypeError && err.message.includes('fetch')) {
      setBackendOffline(true);
      if (
        credentials.username.toLowerCase() === 'admin' &&
        (credentials.password === 'admin' || credentials.password === 'admin123')
      ) {
        return; // Login demo exitoso
      }
      throw {
        error: 'UNAUTHENTICATED',
        mensaje: 'Modo Demo: Usa usuario "admin" y contraseña "admin" o "admin123"',
      };
    }
    throw err;
  }
}
