import type {
  SubCategoria,
  SubCategoriaCreateRequest,
  SubCategoriaUpdateRequest,
  SubCategoriaOrdenItem,
} from '../types/api';
import { apiFetch, isBackendOffline } from './client';
import {
  MOCK_SUBCATEGORIAS,
  mockCreateSubcategoria,
  mockUpdateSubcategoria,
  mockDeleteSubcategoria,
} from './mockData';

/**
 * Listar subcategorías, opcionalmente filtrando por categoría padre.
 * GET /api/subcategorias/categoria/{idCategoria} o GET /api/subcategorias
 */
export async function getSubcategorias(idCategoria?: number | null): Promise<SubCategoria[]> {
  try {
    const endpoint = idCategoria
      ? `/api/subcategorias/categoria/${idCategoria}`
      : '/api/subcategorias';
    return await apiFetch<SubCategoria[]>(endpoint);
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend no disponible al obtener subcategorías. Utilizando datos DEMO.');
      if (idCategoria) {
        return MOCK_SUBCATEGORIAS.filter((s) => s.idCategoria === idCategoria);
      }
      return MOCK_SUBCATEGORIAS;
    }
    throw err;
  }
}

/**
 * Buscar subcategoría por ID.
 * GET /api/subcategorias/{id}
 */
export async function getSubcategoriaById(id: number): Promise<SubCategoria> {
  try {
    return await apiFetch<SubCategoria>(`/api/subcategorias/${id}`);
  } catch (err) {
    if (isBackendOffline()) {
      const encontrada = MOCK_SUBCATEGORIAS.find((s) => s.id === id);
      if (encontrada) return encontrada;
    }
    throw err;
  }
}

/**
 * Buscar subcategoría por nombre exacto dentro de una categoría.
 * GET /api/subcategorias/buscar?idCategoria={idCategoria}&nombre={nombre}
 */
export async function buscarSubcategoriaPorNombre(
  idCategoria: number,
  nombre: string
): Promise<SubCategoria> {
  return await apiFetch<SubCategoria>(
    `/api/subcategorias/buscar?idCategoria=${idCategoria}&nombre=${encodeURIComponent(nombre)}`
  );
}

/**
 * Crear subcategoría.
 * POST /api/subcategorias
 */
export async function createSubcategoria(data: SubCategoriaCreateRequest): Promise<void> {
  try {
    await apiFetch<void>('/api/subcategorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando creación de subcategoría.');
      mockCreateSubcategoria(data);
      return;
    }
    throw err;
  }
}

/**
 * Modificar subcategoría existente.
 * PUT /api/subcategorias/{id}
 */
export async function updateSubcategoria(
  id: number,
  data: SubCategoriaUpdateRequest
): Promise<void> {
  try {
    await apiFetch<void>(`/api/subcategorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando modificación de subcategoría.');
      mockUpdateSubcategoria(id, data);
      return;
    }
    throw err;
  }
}

/**
 * Cambiar orden de subcategoría individual.
 * PATCH /api/subcategorias/{id}/orden
 */
export async function cambiarOrdenSubcategoria(
  id: number,
  idCategoria: number,
  orden: number
): Promise<void> {
  await apiFetch<void>(`/api/subcategorias/${id}/orden`, {
    method: 'PATCH',
    body: JSON.stringify({ idCategoria, orden }),
  });
}

/**
 * Reordenar subcategorías en lote de una categoría específica.
 * PATCH /api/subcategorias/categoria/{idCategoria}/orden
 */
export async function reordenarSubcategoriasLote(
  idCategoria: number,
  items: SubCategoriaOrdenItem[]
): Promise<void> {
  await apiFetch<void>(`/api/subcategorias/categoria/${idCategoria}/orden`, {
    method: 'PATCH',
    body: JSON.stringify(items),
  });
}

/**
 * Eliminar subcategoría por ID.
 * DELETE /api/subcategorias/{id}
 */
export async function deleteSubcategoria(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/subcategorias/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando eliminación de subcategoría.');
      mockDeleteSubcategoria(id);
      return;
    }
    throw err;
  }
}
