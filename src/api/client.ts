import type { ApiErrorResponse } from '../types/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Variable de estado reactivo simple para rastrear si el backend responde
let backendOffline = false;

export function isBackendOffline(): boolean {
  return backendOffline;
}

export function setBackendOffline(status: boolean): void {
  backendOffline = status;
}

/**
 * Cliente HTTP base para realizar peticiones al backend REST.
 * Maneja credenciales (cookies HttpOnly 'access_token') y normaliza respuestas de error.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Solo agregar Content-Type: application/json si no es FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    credentials: 'include', // Soporte para cookies HttpOnly del backend
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es OK
    if (!response.ok) {
      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: 'SERVER_ERROR',
          mensaje: `Error HTTP ${response.status}: ${response.statusText}`,
        };
      }
      throw errorData;
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    backendOffline = false;
    return (await response.json()) as T;
  } catch (error: any) {
    // Si es error de conexión de red (backend no está levantado)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      backendOffline = true;
    }
    throw error;
  }
}
