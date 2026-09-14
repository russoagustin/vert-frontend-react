import type { ApiErrorResponse } from '../types/api';

// En desarrollo se utiliza el proxy de Vite (cadena vacía '') para redirigir a http://localhost:8080 sin problemas de CORS ni cookies
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

let backendOffline = false;

export function isBackendOffline(): boolean {
  return backendOffline;
}

export function setBackendOffline(status: boolean): void {
  backendOffline = status;
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/**
 * Cliente HTTP base para realizar peticiones a la API REST de Vert Catálogo.
 * Soporta credenciales (cookies HttpOnly 'access_token') y normaliza respuestas y errores.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  // No agregar Content-Type si el cuerpo es FormData; el navegador debe fijar el boundary multipart automáticamente
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json; charset=UTF-8';
  }

  const config: RequestInit = {
    ...options,
    credentials: 'include', // Imprescindible para cookies HttpOnly (access_token)
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Si el backend respondió, está en línea
    backendOffline = false;

    // Si la respuesta no es satisfactoria (4xx, 5xx)
    if (!response.ok) {
      // Si la sesión expiró formalmente (401 Unauthorized) en un endpoint protegido, disparar deslogueo
      if (
        response.status === 401 &&
        !cleanEndpoint.includes('/api/auth/login') &&
        unauthorizedHandler
      ) {
        unauthorizedHandler();
      }

      let errorData: ApiErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          error: response.status === 401 ? 'UNAUTHENTICATED' : response.status === 403 ? 'FORBIDDEN' : response.status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
          mensaje: `Error HTTP ${response.status}: ${response.statusText}`,
        };
      }
      throw errorData;
    }

    // Respuestas 204 No Content o sin cuerpo
    if (response.status === 204) {
      return {} as T;
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error: any) {
    // Si fue un fallo estricto de red (servidor completamente apagado o caída de conexión)
    if (
      error instanceof TypeError &&
      (error.message.includes('fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch'))
    ) {
      backendOffline = true;
    }
    throw error;
  }
}
