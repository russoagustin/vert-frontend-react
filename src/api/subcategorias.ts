import type { SubCategoria, SubCategoriaCreateRequest, SubCategoriaUpdateRequest } from '../types/api';
import { apiFetch, setBackendOffline } from './client';
import {
  MOCK_SUBCATEGORIAS,
  mockCreateSubcategoria,
  mockUpdateSubcategoria,
  mockDeleteSubcategoria,
} from './mockData';

export async function getSubcategorias(idCategoria?: number | null): Promise<SubCategoria[]> {
  try {
    const endpoint = idCategoria
      ? `/api/subcategorias/categoria/${idCategoria}`
      : '/api/subcategorias';
    return await apiFetch<SubCategoria[]>(endpoint);
  } catch (err) {
    console.warn('Backend no disponible al obtener subcategorías. Utilizando datos DEMO.', err);
    setBackendOffline(true);
    if (idCategoria) {
      return MOCK_SUBCATEGORIAS.filter((s) => s.idCategoria === idCategoria);
    }
    return MOCK_SUBCATEGORIAS;
  }
}

export async function getSubcategoriaById(id: number): Promise<SubCategoria> {
  try {
    return await apiFetch<SubCategoria>(`/api/subcategorias/${id}`);
  } catch (err) {
    const encontrada = MOCK_SUBCATEGORIAS.find((s) => s.id === id);
    if (encontrada) return encontrada;
    throw err;
  }
}

export async function createSubcategoria(data: SubCategoriaCreateRequest): Promise<void> {
  try {
    await apiFetch<void>('/api/subcategorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Error en backend, aplicando creación de subcategoría en modo DEMO:', err);
    mockCreateSubcategoria(data);
  }
}

export async function updateSubcategoria(id: number, data: SubCategoriaUpdateRequest): Promise<void> {
  try {
    await apiFetch<void>(`/api/subcategorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Error en backend, aplicando modificación de subcategoría en modo DEMO:', err);
    mockUpdateSubcategoria(id, data);
  }
}

export async function deleteSubcategoria(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/subcategorias/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Error en backend, aplicando eliminación de subcategoría en modo DEMO:', err);
    mockDeleteSubcategoria(id);
  }
}
