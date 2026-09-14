// ==========================================
// Tipos de Errores y Paginación (Spring Data)
// ==========================================
export type ErrorCode = 
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "SERVER_ERROR";

export interface ApiErrorResponse<T = string | Record<string, string>> {
  error: ErrorCode;
  mensaje: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Página actual (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

// ==========================================
// Autenticación
// ==========================================
export interface LoginRequest {
  username: string;
  password: string;
}
// ==========================================
// Categorías
// ==========================================
export interface Categoria {
  id: number;
  nombre: string;
  orden: number;
}

export interface CategoriaCreateRequest {
  nombre: string;
  orden?: number;
}

export interface CategoriaUpdateRequest {
  nombre: string;
}

export interface CategoriaOrdenItem {
  id: number;
  orden: number;
}

// ==========================================
// SubCategorías
// ==========================================
export interface SubCategoria {
  id: number;
  idCategoria: number;
  nombre: string;
  orden: number;
}

export interface SubCategoriaCreateRequest {
  idCategoria: number;
  nombre: string;
  orden?: number;
}

export interface SubCategoriaUpdateRequest {
  idCategoria?: number;
  nombre: string;
}

export interface SubCategoriaOrdenItem {
  id: number;
  orden: number;
}

// ==========================================
// Productos
// ==========================================
export interface Producto {
  id: number;
  idCategoria: number;
  idSubCategoria: number;
  nombre: string;
  precio: number;
  precioDescuento: number | null;
  descripcion: string | null;
  imgUrl: string | null;
  cantidad: number | null; // Stock disponible
  suffix?: string;
}

export interface ProductoCreateRequest {
  idCategoria: number;
  idSubCategoria: number;
  nombre: string;
  precio: number;
  precioDescuento?: number | null;
  descripcion?: string | null;
  cantidad?: number | null;
}

export interface ProductoUpdateRequest {
  idCategoria?: number;
  idSubCategoria?: number;
  nombre?: string;
  precio?: number;
  precioDescuento?: number | null;
  descripcion?: string | null;
  cantidad?: number | null;
}

// ==========================================
// Filtros y Modelos UI del Catálogo
// ==========================================
export interface ProductFilterParams {
  idCategoria?: number | null;
  idSubCategoria?: number | null;
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export interface CategoriaConSubcategorias extends Categoria {
  subcategorias: SubCategoria[];
}
