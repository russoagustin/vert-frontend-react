import type { ApiErrorResponse } from '../types/api';

/**
 * Normaliza los errores del backend para mostrarlos fácilmente en formularios.
 * Si el mensaje es un objeto de validación { nombre: "...", precio: "..." }, lo retorna.
 * Si es una cadena, lo asigna a la clave 'general'.
 */
export function obtenerMensajesDeError(error: unknown): Record<string, string> {
  const apiError = error as ApiErrorResponse;

  if (!apiError || !apiError.mensaje) {
    return { general: 'Ocurrió un error inesperado.' };
  }

  if (typeof apiError.mensaje === 'string') {
    return { general: apiError.mensaje };
  }

  // Si es un diccionario de validación de campos: { nombre: "...", precio: "..." }
  return apiError.mensaje;
}

/**
 * Formatea cualquier error de la API a una cadena de texto legible para el usuario.
 */
export function formatErrorMessage(error: unknown, defaultMessage = 'Ocurrió un error en el servidor.'): string {
  if (!error) return defaultMessage;

  const apiError = error as ApiErrorResponse;

  if (typeof apiError?.mensaje === 'string') {
    return apiError.mensaje;
  }

  if (typeof apiError?.mensaje === 'object' && apiError.mensaje !== null) {
    const errorMap = apiError.mensaje as Record<string, string>;
    const messages = Object.values(errorMap).filter(Boolean);
    if (messages.length > 0) {
      return messages.join(' | ');
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}
