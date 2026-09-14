import type {
  Producto,
  PageResponse,
  ProductFilterParams,
  ProductoCreateRequest,
  ProductoUpdateRequest,
} from '../types/api';
import { apiFetch, isBackendOffline } from './client';
import {
  getMockProductosPaginados,
  MOCK_PRODUCTOS,
  mockCreateProducto,
  mockUpdateProducto,
  mockDeleteProducto,
} from './mockData';

/**
 * Listar productos paginados con filtros opcionales (Spring Data Pageable).
 * GET /api/productos?idCategoria=...&idSubCategoria=...&page=...&size=...&sort=...
 */
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

    // Filtrado de búsqueda textual local en la página activa si se envió search
    if (params.search && params.search.trim() !== '' && data.content) {
      const searchLower = params.search.toLowerCase().trim();
      const filtered = data.content.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchLower) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(searchLower))
      );
      return {
        ...data,
        content: filtered,
        numberOfElements: filtered.length,
      };
    }

    return data;
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend no disponible al obtener productos. Utilizando datos DEMO.');
      return getMockProductosPaginados(params);
    }
    throw err;
  }
}

/**
 * Buscar producto por ID.
 * GET /api/productos/{id}
 */
export async function getProductoById(id: number): Promise<Producto> {
  try {
    return await apiFetch<Producto>(`/api/productos/${id}`);
  } catch (err) {
    if (isBackendOffline()) {
      const encontrado = MOCK_PRODUCTOS.find((p) => p.id === id);
      if (encontrado) return encontrado;
    }
    throw err;
  }
}

/**
 * Buscar producto por coincidencia de nombre exacto.
 * GET /api/productos/buscar?nombre={nombre}
 */
export async function buscarProductoPorNombre(nombre: string): Promise<Producto> {
  return await apiFetch<Producto>(`/api/productos/buscar?nombre=${encodeURIComponent(nombre)}`);
}

/**
 * Crear producto con subida obligatoria de imagen (multipart/form-data).
 * Según Sección 4.6 y 11.3:
 * - Parte 'producto': Blob JSON con application/json
 * - Parte 'imagen': archivo binario (File)
 * POST /api/productos
 */
export async function createProducto(
  data: ProductoCreateRequest,
  imageFile?: File
): Promise<void> {
  try {
    const formData = new FormData();

    // 1. JSON Blob con Content-Type application/json explícito
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
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando creación de producto.');
      mockCreateProducto(data, imageFile);
      return;
    }
    throw err;
  }
}

/**
 * Modificar producto.
 * Si se incluye newImageFile: envía multipart/form-data (Sección 4.7).
 * Si no hay foto nueva: envía application/json manteniendo la foto actual (Sección 4.8).
 * PUT /api/productos/{id}
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
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando modificación de producto.');
      mockUpdateProducto(id, data, newImageFile);
      return;
    }
    throw err;
  }
}

/**
 * Eliminar producto por ID.
 * DELETE /api/productos/{id}
 */
export async function deleteProducto(id: number): Promise<void> {
  try {
    await apiFetch<void>(`/api/productos/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    if (isBackendOffline()) {
      console.warn('Backend desconectado, simulando eliminación de producto.');
      mockDeleteProducto(id);
      return;
    }
    throw err;
  }
}
