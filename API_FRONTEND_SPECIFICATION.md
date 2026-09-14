# 📡 Especificación de la API para Frontend — Catálogo Vert

Guía técnica completa y detallada de la API REST del sistema **Vert Catálogo**. Diseñada específicamente para el equipo de desarrollo frontend (React, Next.js, Vue, mobile o cualquier cliente web).

---

## 📑 Tabla de Contenidos

1. [Información General y Conectividad](#1-información-general-y-conectividad)
2. [Estrategia de Autenticación y Seguridad](#2-estrategia-de-autenticación-y-seguridad)
3. [Estructura Global de Errores](#3-estructura-global-de-errores)
4. [Estructura de Respuestas Paginadas](#4-estructura-de-respuestas-paginadas)
5. [Modelos de Datos y Tipos TypeScript](#5-modelos-de-datos-y-tipos-typescript)
6. [Resumen Rápido de Endpoints](#6-resumen-rápido-de-endpoints)
7. [Módulo 1: Autenticación (`/api/auth`)](#módulo-1-autenticación-apiauth)
8. [Módulo 2: Categorías (`/api/categorias`)](#módulo-2-categorías-apicategorias)
9. [Módulo 3: SubCategorías (`/api/subcategorias`)](#módulo-3-subcategorías-apisubcategorias)
10. [Módulo 4: Productos (`/api/productos`)](#módulo-4-productos-apiproductos)
11. [Guía de Integración Frontend (Snippets Listos para Usar)](#11-guía-de-integración-frontend-snippets-listos-para-usar)

---

## 1. Información General y Conectividad

- **Base URL (Desarrollo local)**: `http://localhost:8080`
- **Base URL (Producción / Staging)**: *(según dominio configurado, ej: `https://api.accesoriosvert.online`)*
- **Content-Type por defecto**: `application/json; charset=UTF-8`
- **Nomenclatura de atributos**: `camelCase` en todos los JSON de petición y respuesta.
- **Formato numérico**:
  - `id`, `orden`, `cantidad`, `page`, `size`: Enteros (`number`).
  - `precio`, `precioDescuento`: Decimales (`number`, con 2 decimales, ej: `3500.50`).

---

## 2. Estrategia de Autenticación y Seguridad

El backend utiliza **JWT (JSON Web Token)** con cifrado HMAC256.

### Reglas de Acceso:
- 🔓 **Endpoints Públicos**:
  - Todo el catálogo público para clientes finales (métodos `GET` de `/api/categorias/**`, `/api/subcategorias/**`, `/api/productos/**`).
  - Login administrativo (`POST /api/auth/login`).
- 🔒 **Endpoints Protegidos (Panel de Administración)**:
  - Todas las operaciones de creación (`POST`), modificación (`PUT`), reordenamiento (`PATCH`) y borrado (`DELETE`).

### Cómo enviar la autenticación desde el Frontend:
El backend soporta dos métodos de autenticación:

1. **Vía Cookie HttpOnly (`access_token`)**:
   - Al hacer login exitoso (`POST /api/auth/login`), el backend emite una cabecera `Set-Cookie: access_token=...; Path=/; HttpOnly; SameSite=Strict`.
   - **Requisito en el cliente**: Las peticiones de Axios deben tener `withCredentials: true` o en Fetch `credentials: 'include'`.
2. **Vía Cabecera HTTP `Authorization`**:
   - `Authorization: Bearer <token_jwt>`
   - Útil si extraes el token del flujo de autenticación o para clientes móviles/SSR.

> ⚠️ **Nota de Seguridad**: Si se envía una petición protegida sin credenciales válidas o con el token expirado, el backend responderá con código HTTP `401 Unauthorized` o `403 Forbidden`.

---

## 3. Estructura Global de Errores

Todas las excepciones no controladas y validaciones devuelven un formato JSON estandarizado:

```typescript
interface ApiErrorResponse<T = string | Record<string, string>> {
  error: "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHENTICATED" | "FORBIDDEN" | "SERVER_ERROR";
  mensaje: T;
}
```

### Casos de Respuesta de Error:

#### A. Error de Validación de Campos de Formulario (`400 Bad Request`)
Cuando fallan validaciones de entrada (`@NotNull`, `@NotBlank`, `@PositiveOrZero`, etc.), `mensaje` es un **objeto clave-valor** donde la clave es el nombre del campo y el valor es la descripción del error:
```json
{
  "error": "VALIDATION_ERROR",
  "mensaje": {
    "nombre": "El nombre de la categoría no puede ser nulo ni estar vacío.",
    "precio": "El precio del producto debe ser mayor o igual a 0.",
    "precioDescuentoValido": "El precio de descuento no puede ser mayor al precio regular."
  }
}
```

#### B. Error de Regla de Negocio / Procedimiento Almacenado (`400 Bad Request`)
Cuando se viola una restricción de negocio en la base de datos (por ejemplo, nombres repetidos o cantidades inválidas en reordenamiento):
```json
{
  "error": "VALIDATION_ERROR",
  "mensaje": "Error: El nombre de la categoría ya se encuentra en uso."
}
```

#### C. Recurso No Encontrado (`404 Not Found`)
```json
{
  "error": "NOT_FOUND",
  "mensaje": "Producto no encontrado con id: 45"
}
```

#### D. No Autorizado (`401 Unauthorized` / `403 Forbidden`)
```json
{
  "error": "UNAUTHENTICATED",
  "mensaje": "No se proporcionó un token de acceso válido o ha expirado."
}
```

---

## 4. Estructura de Respuestas Paginadas

Todos los listados de productos devuelven un objeto página estándar de Spring Data:

```json
{
  "content": [
    {
      "id": 1,
      "idCategoria": 1,
      "idSubCategoria": 1,
      "nombre": "Vincha Trenzada Rosa",
      "precio": 3500.00,
      "precioDescuento": 2990.00,
      "descripcion": "Vincha acolchada de raso premium",
      "imgUrl": "https://media.accesoriosvert.online/abc-123-vincha.jpg",
      "cantidad": 12
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 14,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 5,
  "totalElements": 68,
  "last": false,
  "size": 14,
  "number": 0,
  "sort": {
    "empty": false,
    "sorted": true,
    "unsorted": false
  },
  "numberOfElements": 14,
  "first": true,
  "empty": false
}
```

### Parámetros de Consulta (Query Params) para Paginación:
- `page`: Número de página (**base 0**; la primera página es `0`). Default: `0`.
- `size`: Cantidad de ítems por página. Default: `14`.
- `sort`: Campo y dirección de ordenamiento. Formato: `campo,asc` o `campo,desc`.
  - Ejemplos: `sort=precio,asc`, `sort=nombre,asc`, `sort=id,desc`.

---

## 5. Modelos de Datos y Tipos TypeScript

Puedes copiar y pegar estas interfaces directamente en tu proyecto frontend (ej. `src/types/api.ts`):

```typescript
// ==========================================
// Tipos de Errores y Paginación
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
  orden?: number; // Opcional, el backend calcula automáticamente el último
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
```

---

## 6. Resumen Rápido de Endpoints

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **AUTH** | | | |
| `POST` | `/api/auth/login` | 🔓 Público | Iniciar sesión y obtener cookie JWT `access_token` |
| **CATEGORÍAS** | | | |
| `GET` | `/api/categorias` | 🔓 Público | Listar todas las categorías (ordenadas por `orden ASC`) |
| `GET` | `/api/categorias/{id}` | 🔓 Público | Obtener una categoría por ID |
| `GET` | `/api/categorias/buscar` | 🔓 Público | Buscar categoría por nombre exacto (`?nombre=...`) |
| `POST` | `/api/categorias` | 🔒 Protegido | Crear categoría |
| `PUT` | `/api/categorias/{id}` | 🔒 Protegido | Modificar nombre de categoría |
| `PATCH` | `/api/categorias/{id}/orden` | 🔒 Protegido | Cambiar posición de una categoría individual |
| `PATCH` | `/api/categorias/orden` | 🔒 Protegido | Reordenar en lote todas las categorías existentes |
| `DELETE` | `/api/categorias/{id}` | 🔒 Protegido | Eliminar categoría |
| **SUBCATEGORÍAS** | | | |
| `GET` | `/api/subcategorias` | 🔓 Público | Listar subcategorías (opcional filtro `?idCategoria=...`) |
| `GET` | `/api/subcategorias/categoria/{idCategoria}` | 🔓 Público | Listar subcategorías de una categoría específica |
| `GET` | `/api/subcategorias/{id}` | 🔓 Público | Obtener subcategoría por ID |
| `GET` | `/api/subcategorias/categoria/{idCategoria}/{id}` | 🔓 Público | Obtener subcategoría validando su categoría padre |
| `GET` | `/api/subcategorias/buscar` | 🔓 Público | Buscar por nombre exacto (`?idCategoria=...&nombre=...`) |
| `POST` | `/api/subcategorias` | 🔒 Protegido | Crear subcategoría |
| `PUT` | `/api/subcategorias/{id}` | 🔒 Protegido | Modificar subcategoría |
| `PATCH` | `/api/subcategorias/{id}/orden` | 🔒 Protegido | Cambiar posición individual de subcategoría |
| `PATCH` | `/api/subcategorias/orden` | 🔒 Protegido | Reordenar en lote con query param `?idCategoria=...` |
| `PATCH` | `/api/subcategorias/categoria/{idCategoria}/orden` | 🔒 Protegido | Reordenar en lote con path param |
| `DELETE` | `/api/subcategorias/{id}` | 🔒 Protegido | Eliminar subcategoría |
| `DELETE` | `/api/subcategorias/categoria/{idCategoria}/{id}` | 🔒 Protegido | Eliminar subcategoría validando categoría padre |
| **PRODUCTOS** | | | |
| `GET` | `/api/productos` | 🔓 Público | Listado paginado general (filtros opcionales de categoría/subcategoría) |
| `GET` | `/api/productos/categoria/{idCategoria}` | 🔓 Público | Listado paginado de productos de una categoría |
| `GET` | `/api/productos/categoria/{idCat}/subcategoria/{idSubCat}` | 🔓 Público | Listado paginado de categoría y subcategoría |
| `GET` | `/api/productos/{id}` | 🔓 Público | Obtener detalle de producto por ID |
| `GET` | `/api/productos/buscar` | 🔓 Público | Buscar producto por nombre exacto (`?nombre=...`) |
| `POST` | `/api/productos` | 🔒 Protegido | Crear producto con subida obligatoria de imagen (`multipart/form-data`) |
| `PUT` | `/api/productos/{id}` *(multipart)* | 🔒 Protegido | Modificar producto reemplazando la imagen (`multipart/form-data`) |
| `PUT` | `/api/productos/{id}` *(json)* | 🔒 Protegido | Modificar producto manteniendo la imagen actual (`application/json`) |
| `DELETE` | `/api/productos/{id}` | 🔒 Protegido | Eliminar producto |

---

## Módulo 1: Autenticación (`/api/auth`)

### 1.1 Iniciar Sesión (Login)
Autentica al usuario contra la base de datos. Si es válido, emite una cookie segura `access_token` con el JWT.

- **Método**: `POST`
- **Ruta**: `/api/auth/login`
- **Acceso**: 🔓 Público
- **Headers**:
  - `Content-Type: application/json`

#### Request Body:
```json
{
  "username": "admin",
  "password": "miPasswordSeguro123"
}
```

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `username` | `string` | **Sí** | Usuario administrador. |
| `password` | `string` | **Sí** | Contraseña del usuario. |

#### Respuestas:
- **`200 OK`**:
  - **Headers de respuesta**:
    ```http
    Set-Cookie: access_token=eyJhbGciOiJIUzI1Ni...; Path=/; Max-Age=1800; HttpOnly; SameSite=Strict
    ```
  - **Body**: *(Vacío)*
- **`401 Unauthorized`**: Credenciales inválidas.
  ```json
  {
    "error": "UNAUTHENTICATED",
    "mensaje": "Bad credentials"
  }
  ```

---

## Módulo 2: Categorías (`/api/categorias`)

Las categorías se gestionan de forma secuencial y ordenada (`orden` = 1, 2, 3...). Al crear una categoría, el backend calcula automáticamente el siguiente orden disponible.

---

### 2.1 Listar Categorías
Retorna todas las categorías ordenadas por el campo `orden` de forma ascendente.

- **Método**: `GET`
- **Ruta**: `/api/categorias`
- **Acceso**: 🔓 Público

#### Respuestas:
- **`200 OK`**:
```json
[
  {
    "id": 1,
    "nombre": "Accesorios de Pelo",
    "orden": 1
  },
  {
    "id": 2,
    "nombre": "Bijouterie",
    "orden": 2
  },
  {
    "id": 3,
    "nombre": "Carteras y Bolsos",
    "orden": 3
  }
]
```

---

### 2.2 Buscar Categoría por ID
- **Método**: `GET`
- **Ruta**: `/api/categorias/{id}`
- **Acceso**: 🔓 Público

#### Parámetros:
- `id` *(Path, number, requerido)*: ID numérico de la categoría.

#### Respuestas:
- **`200 OK`**:
```json
{
  "id": 1,
  "nombre": "Accesorios de Pelo",
  "orden": 1
}
```
- **`404 Not Found`**:
```json
{
  "error": "NOT_FOUND",
  "mensaje": "Categoria no encontrada"
}
```

---

### 2.3 Buscar Categoría por Nombre
Busca una categoría con coincidencia exacta de nombre.

- **Método**: `GET`
- **Ruta**: `/api/categorias/buscar`
- **Acceso**: 🔓 Público
- **Query Params**:
  - `nombre` *(string, requerido)*: Nombre exacto a buscar (ej: `/api/categorias/buscar?nombre=Bijouterie`).

#### Respuestas:
- **`200 OK`**: Retorna el objeto `CategoriaDto`.
- **`404 Not Found`**:
```json
{
  "error": "NOT_FOUND",
  "mensaje": "Categoria no encontrada"
}
```

---

### 2.4 Crear Categoría
Crea una nueva categoría. El campo `orden` es calculado automáticamente al final de la lista.

- **Método**: `POST`
- **Ruta**: `/api/categorias`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Headers**:
  - `Content-Type: application/json`

#### Request Body:
```json
{
  "nombre": "Maquillaje"
}
```

| Campo | Tipo | Requerido | Regla de Validación |
| :--- | :--- | :--- | :--- |
| `nombre` | `string` | **Sí** | No puede ser nulo ni estar en blanco. Debe ser único en el sistema. |

#### Respuestas:
- **`201 Created`**:
  - **Headers**: `Location: http://localhost:8080/api/categorias/4`
  - **Body**: *(Vacío)*
- **`400 Bad Request`** (Nombre vacío o duplicado):
```json
{
  "error": "VALIDATION_ERROR",
  "mensaje": {
    "nombre": "El nombre de la categoría no puede ser nulo ni estar vacío."
  }
}
```
o por nombre duplicado (procedimiento de base de datos):
```json
{
  "error": "VALIDATION_ERROR",
  "mensaje": "Error: El nombre de la categoría ya se encuentra en uso."
}
```
- **`401 Unauthorized`**: Token ausente o expirado.

---

### 2.5 Modificar Categoría
Modifica el nombre de una categoría existente.

- **Método**: `PUT`
- **Ruta**: `/api/categorias/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Headers**:
  - `Content-Type: application/json`

#### Request Body:
```json
{
  "nombre": "Accesorios y Moda"
}
```

#### Respuestas:
- **`204 No Content`**: Actualizado exitosamente.
- **`400 Bad Request`**: Nombre inválido o duplicado.
- **`404 Not Found`**: Categoría no existe.

---

### 2.6 Cambiar Orden de Categoría (Individual)
Mueve una categoría a una nueva posición. Las categorías intermedias se desplazan automáticamente.

- **Método**: `PATCH`
- **Ruta**: `/api/categorias/{id}/orden`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Request Body:
```json
{
  "orden": 2
}
```

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `orden` | `number` | **Sí** | Nueva posición deseada (entero mayor a 0). |

#### Respuestas:
- **`204 No Content`**: Reordenamiento exitoso.
- **`404 Not Found`**: Categoría no existe.

---

### 2.7 Reordenar Categorías en Lote
Permite reordenar simultáneamente la totalidad de las categorías.
> ⚠️ **REGLA ESTRICTA**: Se debe enviar el arreglo con **todas** las categorías registradas en la base de datos, sin IDs duplicados ni órdenes repetidos.

- **Método**: `PATCH`
- **Ruta**: `/api/categorias/orden`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Request Body:
```json
[
  { "id": 1, "orden": 2 },
  { "id": 2, "orden": 1 },
  { "id": 3, "orden": 3 }
]
```

#### Respuestas:
- **`204 No Content`**: Reordenamiento aplicado exitosamente.
- **`400 Bad Request`**: Faltan categorías en el array o hay IDs/órdenes duplicados:
```json
{
  "error": "VALIDATION_ERROR",
  "mensaje": "Debe enviar el orden de todas las categorías (3 categorías registradas)."
}
```

---

### 2.8 Eliminar Categoría
- **Método**: `DELETE`
- **Ruta**: `/api/categorias/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Respuestas:
- **`204 No Content`**: Eliminada exitosamente.
- **`404 Not Found`**: Categoría no existe.

---

## Módulo 3: SubCategorías (`/api/subcategorias`)

Cada subcategoría pertenece obligatoriamente a una categoría padre (`idCategoria`).

---

### 3.1 Listar SubCategorías
- **Método**: `GET`
- **Ruta**: `/api/subcategorias`
- **Acceso**: 🔓 Público
- **Query Params**:
  - `idCategoria` *(number, opcional)*: Si se especifica, filtra solo las subcategorías pertenecientes a esa categoría padre. Si se omite, retorna todas las subcategorías ordenadas por categoría y orden.

#### Respuestas:
- **`200 OK`**:
```json
[
  {
    "id": 1,
    "idCategoria": 1,
    "nombre": "Vinchas",
    "orden": 1
  },
  {
    "id": 2,
    "idCategoria": 1,
    "nombre": "Scrunchies y Coleros",
    "orden": 2
  }
]
```

---

### 3.2 Listar SubCategorías por Categoría (Ruta alternativa)
- **Método**: `GET`
- **Ruta**: `/api/subcategorias/categoria/{idCategoria}`
- **Acceso**: 🔓 Público

#### Respuestas:
- **`200 OK`**: Arreglo de subcategorías pertenecientes a esa categoría.
- **`404 Not Found`**: Si `idCategoria` no existe.

---

### 3.3 Buscar SubCategoría por ID
- **Métodos disponibles**:
  - `GET /api/subcategorias/{id}` *(con opcional `?idCategoria={id}`)*
  - `GET /api/subcategorias/categoria/{idCategoria}/{id}`
- **Acceso**: 🔓 Público

#### Respuestas:
- **`200 OK`**:
```json
{
  "id": 2,
  "idCategoria": 1,
  "nombre": "Scrunchies y Coleros",
  "orden": 2
}
```
- **`404 Not Found`**: Subcategoría no encontrada.

---

### 3.4 Buscar SubCategoría por Nombre
Busca una subcategoría por nombre exacto dentro de una categoría padre.

- **Método**: `GET`
- **Ruta**: `/api/subcategorias/buscar`
- **Acceso**: 🔓 Público
- **Query Params**:
  - `idCategoria` *(number, requerido)*
  - `nombre` *(string, requerido)*: Ej: `/api/subcategorias/buscar?idCategoria=1&nombre=Vinchas`

#### Respuestas:
- **`200 OK`**: Objeto `SubCategoriaDto`.
- **`404 Not Found`**: Subcategoría no encontrada.

---

### 3.5 Crear SubCategoría
- **Método**: `POST`
- **Ruta**: `/api/subcategorias`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Request Body:
```json
{
  "idCategoria": 1,
  "nombre": "Hebillas y Broches"
}
```

| Campo | Tipo | Requerido | Validaciones |
| :--- | :--- | :--- | :--- |
| `idCategoria` | `number` | **Sí** | `@NotNull`. Debe existir en la BD. |
| `nombre` | `string` | **Sí** | `@NotBlank`. Único dentro de la misma categoría. |

#### Respuestas:
- **`201 Created`**: Header `Location: http://localhost:8080/api/subcategorias/5`.
- **`400 Bad Request`**: Datos inválidos.
- **`404 Not Found`**: Si `idCategoria` no existe en la BD.

---

### 3.6 Modificar SubCategoría
- **Método**: `PUT`
- **Ruta**: `/api/subcategorias/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Request Body:
```json
{
  "idCategoria": 1,
  "nombre": "Hebillas, Broches y Clips"
}
```

#### Respuestas:
- **`204 No Content`**: Modificada exitosamente.
- **`400 Bad Request`**: Error de validación.
- **`404 Not Found`**: Subcategoría o categoría no encontrada.

---

### 3.7 Cambiar Orden de SubCategoría (Individual)
- **Método**: `PATCH`
- **Ruta**: `/api/subcategorias/{id}/orden`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Query Params**: `idCategoria` *(number, opcional si viene en el body)*

#### Request Body:
```json
{
  "idCategoria": 1,
  "orden": 3
}
```

#### Respuestas:
- **`204 No Content`**: Reordenada exitosamente.
- **`404 Not Found`**: Subcategoría no encontrada.

---

### 3.8 Reordenar SubCategorías en Lote
Reordena todas las subcategorías asociadas a una categoría.
> ⚠️ **REGLA ESTRICTA**: Se debe enviar el listado completo de las subcategorías pertenecientes a esa categoría específica.

- **Métodos disponibles**:
  - `PATCH /api/subcategorias/orden?idCategoria=1`
  - `PATCH /api/subcategorias/categoria/1/orden`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Request Body:
```json
[
  { "id": 1, "orden": 2 },
  { "id": 2, "orden": 1 }
]
```

#### Respuestas:
- **`204 No Content`**: Subcategorías reordenadas.
- **`400 Bad Request`**: Si la cantidad de elementos no coincide con el total de subcategorías de la categoría.

---

### 3.9 Eliminar SubCategoría
- **Métodos disponibles**:
  - `DELETE /api/subcategorias/{id}` *(opcional `?idCategoria=...`)*
  - `DELETE /api/subcategorias/categoria/{idCategoria}/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Respuestas:
- **`204 No Content`**: Eliminada exitosamente.
- **`404 Not Found`**: Subcategoría no encontrada.

---

## Módulo 4: Productos (`/api/productos`)

El módulo de productos incluye paginación con Spring Data y almacenamiento de imágenes en Cloudflare R2.

---

### 4.1 Listar Productos (Paginado con Filtros Opcionales)
- **Método**: `GET`
- **Ruta**: `/api/productos`
- **Acceso**: 🔓 Público
- **Query Params**:
  - `idCategoria` *(number, opcional)*: Filtra por categoría.
  - `idSubCategoria` *(number, opcional)*: Filtra por subcategoría (usar junto a `idCategoria`).
  - `page` *(number, opcional, default: `0`)*: Índice de página (comienza en 0).
  - `size` *(number, opcional, default: `14`)*: Cantidad de productos por página.
  - `sort` *(string, opcional, default: `id,asc`)*: Ordenamiento (ej: `precio,desc`, `nombre,asc`).

#### Respuestas:
- **`200 OK`**: Retorna el objeto `PageResponse<Producto>` (ver estructura en Sección 4).
- **`404 Not Found`**: Si la categoría o subcategoría indicada en el filtro no existe.

---

### 4.2 Listar Productos por Categoría (Paginado)
- **Método**: `GET`
- **Ruta**: `/api/productos/categoria/{idCategoria}`
- **Acceso**: 🔓 Público
- **Query Params**: `page`, `size`, `sort`.

#### Respuestas:
- **`200 OK`**: Retorna `PageResponse<Producto>`.
- **`404 Not Found`**: Categoría no encontrada.

---

### 4.3 Listar Productos por Categoría y SubCategoría (Paginado)
- **Método**: `GET`
- **Ruta**: `/api/productos/categoria/{idCategoria}/subcategoria/{idSubCategoria}`
- **Acceso**: 🔓 Público
- **Query Params**: `page`, `size`, `sort`.

#### Respuestas:
- **`200 OK`**: Retorna `PageResponse<Producto>`.
- **`404 Not Found`**: Categoría o Subcategoría no encontrada.

---

### 4.4 Buscar Producto por ID
- **Método**: `GET`
- **Ruta**: `/api/productos/{id}`
- **Acceso**: 🔓 Público

#### Respuestas:
- **`200 OK`**:
```json
{
  "id": 10,
  "idCategoria": 1,
  "idSubCategoria": 2,
  "nombre": "Colero Scrunchie Seda",
  "precio": 2500.00,
  "precioDescuento": 1999.99,
  "descripcion": "Colero scrunchie de seda suave para el pelo",
  "imgUrl": "https://media.accesoriosvert.online/8f5e1823-colero-seda.jpg",
  "cantidad": 30
}
```
- **`404 Not Found`**:
```json
{
  "error": "NOT_FOUND",
  "mensaje": "Producto no encontrado con id: 99"
}
```

---

### 4.5 Buscar Producto por Nombre
- **Método**: `GET`
- **Ruta**: `/api/productos/buscar`
- **Acceso**: 🔓 Público
- **Query Params**:
  - `nombre` *(string, requerido)*: Ej: `/api/productos/buscar?nombre=Colero%20Scrunchie%20Seda`

#### Respuestas:
- **`200 OK`**: Retorna el objeto `Producto`.
- **`404 Not Found`**:
```json
{
  "error": "NOT_FOUND",
  "mensaje": "Producto no encontrado con nombre: Colero Scrunchie Seda"
}
```

---

### 4.6 Crear Producto (Con Imagen Obligatoria)
Para dar de alta un producto, el backend requiere un envío `multipart/form-data` con **dos partes obligatorias**:
1. `producto`: Un Blob JSON con los datos del producto (`application/json`).
2. `imagen`: El archivo binario de la foto del producto.

- **Método**: `POST`
- **Ruta**: `/api/productos`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Headers**:
  - `Content-Type: multipart/form-data`

#### Estructura del `multipart/form-data`:

##### Parte 1: `producto` (`Content-Type: application/json`):
```json
{
  "idCategoria": 1,
  "idSubCategoria": 2,
  "nombre": "Vincha Trenzada Rosa",
  "precio": 3200.50,
  "precioDescuento": 2800.00,
  "descripcion": "Vincha acolchada trenzada de raso color rosa pastel",
  "cantidad": 15
}
```

##### Parte 2: `imagen` (Binary File):
- Archivo de imagen (`image/png`, `image/jpeg`, `image/webp`).

#### Tabla de Campos del objeto `producto`:
| Campo | Tipo | Requerido | Regla de Validación |
| :--- | :--- | :--- | :--- |
| `idCategoria` | `number` | **Sí** | `@NotNull`. Debe existir en la BD. |
| `idSubCategoria`| `number` | **Sí** | `@NotNull`. Debe pertenecer a `idCategoria`. |
| `nombre` | `string` | **Sí** | `@NotBlank`. No vacío. |
| `precio` | `number` | **Sí** | `@NotNull`, `@PositiveOrZero` (`>= 0`). |
| `precioDescuento`| `number` | No | `@PositiveOrZero`. **REGLA**: Debe ser `<= precio`. |
| `descripcion` | `string` | No | Opcional. Texto libre descriptivo. |
| `cantidad` | `number` | No | `@PositiveOrZero` (`>= 0`). Stock de unidades. |

#### Respuestas:
- **`201 Created`**:
  - **Headers**: `Location: http://localhost:8080/api/productos/25`
  - **Body**: *(Vacío)*
- **`400 Bad Request`**:
  - Si falta la imagen: `"La imagen del producto es obligatoria."`
  - Si `precioDescuento > precio`:
    ```json
    {
      "error": "VALIDATION_ERROR",
      "mensaje": {
        "precioDescuentoValido": "El precio de descuento no puede ser mayor al precio regular."
      }
    }
    ```
- **`401 Unauthorized`**: Token no provisto o expirado.
- **`404 Not Found`**: Si la categoría o subcategoría no existen.

---

### 4.7 Modificar Producto Reemplazando Imagen (`multipart/form-data`)
Usa este endpoint cuando el usuario **sube un nuevo archivo** de imagen para reemplazar la foto anterior.

- **Método**: `PUT`
- **Ruta**: `/api/productos/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Headers**: `Content-Type: multipart/form-data`

#### Estructura:
- Parte `producto` (`application/json`): Campos a actualizar.
- Parte `imagen` (File, opcional en `PUT`): Archivo de la nueva foto.

#### Respuestas:
- **`204 No Content`**: Actualizado exitosamente.
- **`400 Bad Request`**: Error de validación.
- **`404 Not Found`**: Producto no encontrado.

---

### 4.8 Modificar Producto sin Tocar Imagen (`application/json`)
Usa este endpoint cuando solo se editan textos o precios (nombre, descripción, stock, categoría, precios), **sin necesidad de reenviar archivos**.

- **Método**: `PUT`
- **Ruta**: `/api/productos/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)
- **Headers**: `Content-Type: application/json`

#### Request Body:
```json
{
  "idCategoria": 1,
  "idSubCategoria": 2,
  "nombre": "Vincha Trenzada Rosa Edición Especial",
  "precio": 3500.00,
  "precioDescuento": 2990.00,
  "descripcion": "Descripción actualizada sin modificar la imagen",
  "cantidad": 20
}
```

#### Respuestas:
- **`204 No Content`**: Actualizado exitosamente.
- **`400 Bad Request`**: Error en datos validados.
- **`404 Not Found`**: Producto no encontrado.

---

### 4.9 Eliminar Producto
- **Método**: `DELETE`
- **Ruta**: `/api/productos/{id}`
- **Acceso**: 🔒 Protegido (Requiere JWT)

#### Respuestas:
- **`204 No Content`**: Eliminado exitosamente.
- **`404 Not Found`**: Producto no encontrado.

---

## 11. Guía de Integración Frontend (Snippets Listos para Usar)

### 11.1 Configuración de Cliente HTTP (Axios)
Crea una instancia global en `src/api/client.ts` con manejo de credenciales y cookies automáticas:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true, // IMPORTANTE: Permite enviar y recibir cookies HttpOnly (access_token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para atrapar y normalizar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Retorna el objeto ApiErrorResponse proveniente del backend
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      error: 'SERVER_ERROR',
      mensaje: 'Error de red o conexión no disponible.',
    });
  }
);
```

---

### 11.2 Servicio de Autenticación
```typescript
import { apiClient } from './client';
import { LoginRequest } from '../types/api';

export const authService = {
  login: async (credentials: LoginRequest): Promise<void> => {
    // Al resolver con 200 OK, la cookie 'access_token' queda guardada en el navegador automáticamente
    await apiClient.post('/api/auth/login', credentials);
  },
};
```

---

### 11.3 Función para Crear Producto con Imagen (`multipart/form-data`)
> 💡 **TRUCO CLAVE PARA SPRING BOOT**: La parte `"producto"` debe enviarse como un `Blob` con tipo `'application/json'`. Si se agrega como texto plano sin tipo, Spring Boot fallará con `HttpMediaTypeNotSupportedException`.

```typescript
import { apiClient } from './client';
import { ProductoCreateRequest } from '../types/api';

export const crearProductoConImagen = async (
  datos: ProductoCreateRequest,
  archivoImagen: File
): Promise<string | null> => {
  const formData = new FormData();

  // 1. Empaquetar los datos del producto como JSON Blob
  const productoBlob = new Blob([JSON.stringify(datos)], {
    type: 'application/json',
  });
  formData.append('producto', productoBlob);

  // 2. Empaquetar el archivo de imagen
  formData.append('imagen', archivoImagen);

  // 3. Enviar la petición
  const response = await apiClient.post('/api/productos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // Retorna la URL del Location header ej: "/api/productos/15"
  return response.headers['location'] || null;
};
```

---

### 11.4 Hook / Helper para Mapear Errores del Backend a Formularios
```typescript
import { ApiErrorResponse } from '../types/api';

/**
 * Normaliza los errores del backend para mostrarlos fácilmente en formularios (React Hook Form, Formik, etc.)
 */
export function obtenerMensajesDeError(error: unknown): Record<string, string> {
  const apiError = error as ApiErrorResponse;
  
  if (!apiError || !apiError.mensaje) {
    return { general: 'Ocurrió un error inesperado.' };
  }

  if (typeof apiError.mensaje === 'string') {
    return { general: apiError.mensaje };
  }

  // Si es un diccionario de campos: { nombre: "...", precio: "..." }
  return apiError.mensaje;
}
```

---

## 🎯 Resumen de Buenas Prácticas para el Frontend

1. **Autenticación transparente**: Configurar `withCredentials: true` en Axios o `credentials: 'include'` en Fetch. No es necesario manipular el JWT manualmente en JavaScript (protección nativa contra XSS mediante `HttpOnly`).
2. **Reordenamientos**: Al usar la funcionalidad drag & drop para categorías o subcategorías, enviar **todos** los elementos correspondientes en el array del endpoint `/orden`.
3. **Validación de precios en el cliente**: Recuerda validar antes del submit que `precioDescuento <= precio` para evitar errores 400.
4. **Paginación base 0**: El parámetro `page` comienza en `0` (`page=0` es la primera página, `page=1` la segunda).
