import type { Categoria, CategoriaCreateRequest, CategoriaUpdateRequest } from '../types/api';
import { apiFetch, setBackendOffline } from './client';
import {
  MOCK_CATEGORIAS,
  mockCreateCategoria,
  mockUpdateCategoria,
  mockDeleteCategoria,
} from './mockData';

export async function getCategorias(): Promise<Categoria[]> {
  try {
    const data = await apiFetch<Categoria[]>('/api/categorias');
    return data;
  } catch (err) {
    console.warn('Backend no disponible al obtener categorías. Utilizando datos DEMO.', err);
    setBackendOffline(true);
    return MOCK_CATEGORIAS;
  }
}

export async function getCategoriaById(id: number): Promise<Categoria> {
  try {
    return await apiFetch<Categoria>(`/api/categorias/${id}`);
  } catch (err) {
    const encontrada = MOCK_CATEGORIAS.find((c) => c.id === id);
    if (encontrada) return encontrada;
    throw err;
  }
}

export async function createCategoria(data: CategoriaCreateRequest): Promise<void> {
  try {
    await apiFetch<void>('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Error en backend, aplicando creación en modo DEMO:', err);
    mockCreateCategoria(data);
  }
}

export async function updateCategoria(id: number, data: CategoriaUpdateRequest): Promise<void> {
  try {
    await apiFetch<void>(`/api/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Error en backend, aplicando modificación en modo DEMO:', err);
    mockUpdateCategoria(id, data);
  }
}

export async function deleteCategoria(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/categorias/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Error en backend, aplicando eliminación en modo DEMO:', err);
    mockDeleteCategoria(id);
  }
}
