import type {
  Producto,
  PageResponse,
  ProductFilterParams,
  ProductoCreateRequest,
  ProductoUpdateRequest,
} from '../types/api';
import { apiFetch, setBackendOffline } from './client';
import {
  getMockProductosPaginados,
  MOCK_PRODUCTOS,
  mockCreateProducto,
  mockUpdateProducto,
  mockDeleteProducto,
} from './mockData';

export async function getProductos(params: ProductFilterParams = {}): Promise<PageResponse<Producto>> {
  const query = new URLSearchParams();

  if (params.idCategoria) query.append('idCategoria', params.idCategoria.toString());
  if (params.idSubCategoria) query.append('idSubCategoria', params.idSubCategoria.toString());
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.size !== undefined) query.append('size', params.size.toString());
  if (params.sort) query.append('sort', params.sort);

  const endpoint = `/api/productos${query.toString() ? `?${query.toString()}` : ''}`;

  try {
    const data = await apiFetch<PageResponse<Producto>>(endpoint);

    if (params.search && params.search.trim() !== '') {
      const searchLower = params.search.toLowerCase().trim();
      const filteredContent = data.content.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchLower) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(searchLower))
      );
      return {
        ...data,
        content: filteredContent,
        numberOfElements: filteredContent.length,
      };
    }

    return data;
  } catch (err) {
    console.warn('Backend no disponible al obtener productos. Utilizando datos DEMO.', err);
    setBackendOffline(true);
    return getMockProductosPaginados(params);
  }
}

export async function getProductoById(id: number): Promise<Producto> {
  try {
    return await apiFetch<Producto>(`/api/productos/${id}`);
  } catch (err) {
    const encontrado = MOCK_PRODUCTOS.find((p) => p.id === id);
    if (encontrado) return encontrado;
    throw err;
  }
}

/**
 * Crear producto con subida multipart/form-data (JSON Blob + imagen binaria)
 * según Sección 11.3 de API_FRONTEND_SPECIFICATION.md
 */
export async function createProducto(
  data: ProductoCreateRequest,
  imageFile?: File
): Promise<void> {
  try {
    const formData = new FormData();

    // 1. JSON Blob con Content-Type application/json requerido por Spring Boot
    const productoBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });
    formData.append('producto', productoBlob);

    // 2. Archivo binario de imagen
    if (imageFile) {
      formData.append('imagen', imageFile);
    }

    await apiFetch<void>('/api/productos', {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    console.warn('Error en backend, aplicando creación de producto en modo DEMO:', err);
    mockCreateProducto(data, imageFile);
  }
}

/**
 * Actualizar producto. Si viene newImageFile, envía multipart/form-data;
 * si no, envía application/json manteniendo la imagen previa.
 */
export async function updateProducto(
  id: number,
  data: ProductoUpdateRequest,
  newImageFile?: File
): Promise<void> {
  try {
    if (newImageFile) {
      const formData = new FormData();
      const productoBlob = new Blob([JSON.stringify(data)], {
        type: 'application/json',
      });
      formData.append('producto', productoBlob);
      formData.append('imagen', newImageFile);

      await apiFetch<void>(`/api/productos/${id}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      await apiFetch<void>(`/api/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  } catch (err) {
    console.warn('Error en backend, aplicando modificación de producto en modo DEMO:', err);
    mockUpdateProducto(id, data, newImageFile);
  }
}

/**
 * Eliminar producto por ID
 */
export async function deleteProducto(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/productos/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Error en backend, aplicando eliminación de producto en modo DEMO:', err);
    mockDeleteProducto(id);
  }
}
