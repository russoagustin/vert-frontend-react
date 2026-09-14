import type {
  Categoria,
  CategoriaCreateRequest,
  CategoriaUpdateRequest,
  CategoriaOrdenItem,
} from '../types/api';
import { apiFetch, isBackendOffline } from './client';
import {
  MOCK_CATEGORIAS,
  mockCreateCategoria,
  mockUpdateCategoria,
  mockDeleteCategoria,
} from './mockData';

/**
 * Listar todas las categorías ordenadas por el campo 'orden' ascendente.
 * GET /api/categorias
 */
export async function getCategorias(): Promise<Categoria[]> {
  try {
    return await apiFetch<Categoria[]>('/api/categorias');
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend no disponible al obtener categorías. Utilizando datos DEMO.');
      return MOCK_CATEGORIAS;
    }
    throw err;
  }
}

/**
 * Buscar categoría por ID.
 * GET /api/categorias/{id}
 */
export async function getCategoriaById(id: number): Promise<Categoria> {
  try {
    return await apiFetch<Categoria>(`/api/categorias/${id}`);
  } catch (err) {
    if (isBackendOffline()) {
      const encontrada = MOCK_CATEGORIAS.find((c) => c.id === id);
      if (encontrada) return encontrada;
    }
    throw err;
  }
}

/**
 * Buscar categoría por nombre exacto.
 * GET /api/categorias/buscar?nombre={nombre}
 */
export async function buscarCategoriaPorNombre(nombre: string): Promise<Categoria> {
  return await apiFetch<Categoria>(`/api/categorias/buscar?nombre=${encodeURIComponent(nombre)}`);
}

/**
 * Crear nueva categoría (el orden se calcula automáticamente al final de la lista).
 * POST /api/categorias
 */
export async function createCategoria(data: CategoriaCreateRequest): Promise<void> {
  try {
    await apiFetch<void>('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando creación localmente.');
      mockCreateCategoria(data);
      return;
    }
    throw err;
  }
}

/**
 * Modificar nombre de categoría existente.
 * PUT /api/categorias/{id}
 */
export async function updateCategoria(id: number, data: CategoriaUpdateRequest): Promise<void> {
  try {
    await apiFetch<void>(`/api/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando modificación localmente.');
      mockUpdateCategoria(id, data);
      return;
    }
    throw err;
  }
}

/**
 * Cambiar orden de categoría individual.
 * PATCH /api/categorias/{id}/orden
 */
export async function cambiarOrdenCategoria(id: number, orden: number): Promise<void> {
  await apiFetch<void>(`/api/categorias/${id}/orden`, {
    method: 'PATCH',
    body: JSON.stringify({ orden }),
  });
}

/**
 * Reordenar categorías en lote (debe enviarse el array con todas las categorías).
 * PATCH /api/categorias/orden
 */
export async function reordenarCategoriasLote(items: CategoriaOrdenItem[]): Promise<void> {
  await apiFetch<void>('/api/categorias/orden', {
    method: 'PATCH',
    body: JSON.stringify(items),
  });
}

/**
 * Eliminar categoría por ID.
 * DELETE /api/categorias/{id}
 */
export async function deleteCategoria(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/categorias/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando eliminación localmente.');
      mockDeleteCategoria(id);
      return;
    }
    throw err;
  }
}
