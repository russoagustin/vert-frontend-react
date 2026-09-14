import type { LoginRequest } from '../types/api';
import { apiFetch } from './client';

/**
 * Iniciar sesión enviando credenciales a la API REST de Spring Boot.
 * En caso de éxito (200 OK), el backend emite la cookie HttpOnly 'access_token'.
 * Si las credenciales son incorrectas, propaga el error (401 Bad credentials o 403 Forbidden).
 */
export async function apiLogin(credentials: LoginRequest): Promise<void> {
  await apiFetch<void>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
