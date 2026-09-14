import type {
  Categoria,
  SubCategoria,
  Producto,
  PageResponse,
  ProductFilterParams,
  ProductoCreateRequest,
  ProductoUpdateRequest,
  CategoriaCreateRequest,
  CategoriaUpdateRequest,
  SubCategoriaCreateRequest,
  SubCategoriaUpdateRequest,
} from '../types/api';

export let MOCK_CATEGORIAS: Categoria[] = [
  { id: 1, nombre: 'Collares', orden: 1 },
  { id: 2, nombre: 'Anillos', orden: 2 },
  { id: 3, nombre: 'Aros y Argollas', orden: 3 },
  { id: 4, nombre: 'Vinchas y Pelo', orden: 4 },
  { id: 5, nombre: 'Pulseras', orden: 5 },
];

export let MOCK_SUBCATEGORIAS: SubCategoria[] = [
  // Collares (idCategoria: 1)
  { id: 1, idCategoria: 1, nombre: 'Acero Quirúrgico', orden: 1 },
  { id: 2, idCategoria: 1, nombre: 'Plata 925', orden: 2 },
  { id: 3, idCategoria: 1, nombre: 'Chokers & Dijes', orden: 3 },

  // Anillos (idCategoria: 2)
  { id: 4, idCategoria: 2, nombre: 'Regulables', orden: 1 },
  { id: 5, idCategoria: 2, nombre: 'Con Piedras & Sellos', orden: 2 },

  // Aros (idCategoria: 3)
  { id: 6, idCategoria: 3, nombre: 'Argollas', orden: 1 },
  { id: 7, idCategoria: 3, nombre: 'Trepadores & Ear Cuffs', orden: 2 },

  // Vinchas (idCategoria: 4)
  { id: 8, idCategoria: 4, nombre: 'Vinchas Acolchadas', orden: 1 },
  { id: 9, idCategoria: 4, nombre: 'Scrunchies de Seda', orden: 2 },

  // Pulseras (idCategoria: 5)
  { id: 10, idCategoria: 5, nombre: 'Eslabones y Cadenas', orden: 1 },
  { id: 11, idCategoria: 5, nombre: 'Hilos y Dijes', orden: 2 },
];

export let MOCK_PRODUCTOS: Producto[] = [
  {
    id: 1,
    idCategoria: 1,
    idSubCategoria: 1,
    nombre: 'Collar Kitty Acero',
    precio: 7000,
    precioDescuento: null,
    descripcion: 'Collar de acero quirúrgico 316L con dije Kitty pulido a espejo. Resistente al agua y no pierde brillo.',
    imgUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    cantidad: 15,
  },
  {
    id: 2,
    idCategoria: 1,
    idSubCategoria: 1,
    nombre: 'Collar Estrellas Fugaces',
    precio: 6000,
    precioDescuento: null,
    descripcion: 'Cadena fina con mini estrellas colgantes. Ideal para combinar en layering con otros collares.',
    imgUrl: 'https://images.unsplash.com/photo-1611591475143-6c0b39e6a0d2?auto=format&fit=crop&w=600&q=80',
    cantidad: 8,
  },
  {
    id: 3,
    idCategoria: 1,
    idSubCategoria: 2,
    nombre: 'Set Collares Dije Cuarzo',
    precio: 6000,
    precioDescuento: 5000,
    descripcion: 'Dúo de collares de plata 925 con dije de cuarzo facetado. Edición limitada especial Vert.',
    imgUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    cantidad: 20,
    suffix: ' c/u',
  },
  {
    id: 4,
    idCategoria: 1,
    idSubCategoria: 2,
    nombre: 'Set Collares Sol & Estrella',
    precio: 7000,
    precioDescuento: null,
    descripcion: 'Diseño cósmico elaborado en plata 925 legítima con cierre marinero reforzado.',
    imgUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    cantidad: 12,
    suffix: ' c/u',
  },
  {
    id: 5,
    idCategoria: 1,
    idSubCategoria: 3,
    nombre: 'Cadena Eslabones Grumet',
    precio: 5000,
    precioDescuento: null,
    descripcion: 'Choker de cadena eslabón ancho estilo industrial cyberpunk. Unisex.',
    imgUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80',
    cantidad: 5,
  },
  {
    id: 6,
    idCategoria: 2,
    idSubCategoria: 4,
    nombre: 'Anillo Fuego Cyber Regulable',
    precio: 3500,
    precioDescuento: 2800,
    descripcion: 'Anillo abierto con silueta de flama estilizada. Se ajusta cómodamente a cualquier dedo.',
    imgUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    cantidad: 18,
  },
  {
    id: 7,
    idCategoria: 2,
    idSubCategoria: 5,
    nombre: 'Sello Ónix Deep Blue',
    precio: 4800,
    precioDescuento: null,
    descripcion: 'Anillo tipo sello macizo con piedra ónix engarzada en acero pulido.',
    imgUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    cantidad: 6,
  },
  {
    id: 8,
    idCategoria: 3,
    idSubCategoria: 6,
    nombre: 'Argollas Twist Neón',
    precio: 3200,
    precioDescuento: 2700,
    descripcion: 'Par de argollas trenzadas livianas con cierre click seguro. Ideales para uso diario.',
    imgUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    cantidad: 24,
  },
  {
    id: 9,
    idCategoria: 3,
    idSubCategoria: 7,
    nombre: 'Ear Cuff Glitch Sin Perforación',
    precio: 2900,
    precioDescuento: null,
    descripcion: 'Aro a presión para cartílago sin necesidad de perforación. Diseño geométrico futurista.',
    imgUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
    cantidad: 0,
  },
  {
    id: 10,
    idCategoria: 4,
    idSubCategoria: 8,
    nombre: 'Vincha Trenzada Rosa Pastel',
    precio: 3500,
    precioDescuento: 2990,
    descripcion: 'Vincha acolchada de raso premium con textura trenzada. Suave al tacto y máxima comodidad.',
    imgUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
    cantidad: 14,
  },
  {
    id: 11,
    idCategoria: 4,
    idSubCategoria: 9,
    nombre: 'Scrunchie Seda Noir',
    precio: 1800,
    precioDescuento: 1500,
    descripcion: 'Coletero elástico de seda pura 100% que cuida el cabello y evita quiebres.',
    imgUrl: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=600&q=80',
    cantidad: 30,
  },
  {
    id: 12,
    idCategoria: 5,
    idSubCategoria: 10,
    nombre: 'Pulsera Eslabón Miami Cuban',
    precio: 6500,
    precioDescuento: 5500,
    descripcion: 'Brazalete con eslabones pulidos de 7mm y broche caja con doble traba de seguridad.',
    imgUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
    cantidad: 9,
  },
];

let nextProductId = 13;
let nextCategoryId = 6;
let nextSubcategoryId = 12;

export function getMockProductosPaginados(params: ProductFilterParams): PageResponse<Producto> {
  const page = params.page ?? 0;
  const size = params.size ?? 12;
  const search = (params.search ?? '').trim().toLowerCase();

  let filtrados = [...MOCK_PRODUCTOS];

  if (params.idCategoria) {
    filtrados = filtrados.filter((p) => p.idCategoria === params.idCategoria);
  }

  if (params.idSubCategoria) {
    filtrados = filtrados.filter((p) => p.idSubCategoria === params.idSubCategoria);
  }

  if (search) {
    filtrados = filtrados.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search))
    );
  }

  if (params.sort) {
    const [campo, direccion] = params.sort.split(',');
    const desc = direccion === 'desc';

    filtrados.sort((a, b) => {
      let valA: any = a[campo as keyof Producto];
      let valB: any = b[campo as keyof Producto];

      if (campo === 'precio') {
        valA = a.precioDescuento ?? a.precio;
        valB = b.precioDescuento ?? b.precio;
      }

      if (valA < valB) return desc ? 1 : -1;
      if (valA > valB) return desc ? -1 : 1;
      return 0;
    });
  }

  const totalElements = filtrados.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const startIndex = page * size;
  const content = filtrados.slice(startIndex, startIndex + size);

  return {
    content,
    totalPages,
    totalElements,
    size,
    number: page,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
    numberOfElements: content.length,
  };
}

// Operaciones mock para Productos
export function mockCreateProducto(data: ProductoCreateRequest, imageFile?: File): Producto {
  const nuevo: Producto = {
    id: nextProductId++,
    idCategoria: data.idCategoria,
    idSubCategoria: data.idSubCategoria,
    nombre: data.nombre,
    precio: data.precio,
    precioDescuento: data.precioDescuento ?? null,
    descripcion: data.descripcion ?? null,
    cantidad: data.cantidad ?? 0,
    imgUrl: imageFile
      ? URL.createObjectURL(imageFile)
      : 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
  };
  MOCK_PRODUCTOS.unshift(nuevo);
  return nuevo;
}

export function mockUpdateProducto(id: number, data: ProductoUpdateRequest, newImageFile?: File): void {
  const index = MOCK_PRODUCTOS.findIndex((p) => p.id === id);
  if (index === -1) throw { error: 'NOT_FOUND', mensaje: 'Producto no encontrado' };

  const actual = MOCK_PRODUCTOS[index];
  MOCK_PRODUCTOS[index] = {
    ...actual,
    ...(data.nombre !== undefined && { nombre: data.nombre }),
    ...(data.precio !== undefined && { precio: data.precio }),
    ...(data.precioDescuento !== undefined && { precioDescuento: data.precioDescuento }),
    ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
    ...(data.cantidad !== undefined && { cantidad: data.cantidad }),
    ...(data.idCategoria !== undefined && { idCategoria: data.idCategoria }),
    ...(data.idSubCategoria !== undefined && { idSubCategoria: data.idSubCategoria }),
    ...(newImageFile && { imgUrl: URL.createObjectURL(newImageFile) }),
  };
}

export function mockDeleteProducto(id: number): void {
  MOCK_PRODUCTOS = MOCK_PRODUCTOS.filter((p) => p.id !== id);
}

// Operaciones mock para Categorías
export function mockCreateCategoria(data: CategoriaCreateRequest): Categoria {
  const nueva: Categoria = {
    id: nextCategoryId++,
    nombre: data.nombre,
    orden: data.orden ?? MOCK_CATEGORIAS.length + 1,
  };
  MOCK_CATEGORIAS.push(nueva);
  return nueva;
}

export function mockUpdateCategoria(id: number, data: CategoriaUpdateRequest): void {
  const cat = MOCK_CATEGORIAS.find((c) => c.id === id);
  if (!cat) throw { error: 'NOT_FOUND', mensaje: 'Categoría no encontrada' };
  cat.nombre = data.nombre;
}

export function mockDeleteCategoria(id: number): void {
  MOCK_CATEGORIAS = MOCK_CATEGORIAS.filter((c) => c.id !== id);
  MOCK_SUBCATEGORIAS = MOCK_SUBCATEGORIAS.filter((s) => s.idCategoria !== id);
}

// Operaciones mock para Subcategorías
export function mockCreateSubcategoria(data: SubCategoriaCreateRequest): SubCategoria {
  const nueva: SubCategoria = {
    id: nextSubcategoryId++,
    idCategoria: data.idCategoria,
    nombre: data.nombre,
    orden: data.orden ?? MOCK_SUBCATEGORIAS.length + 1,
  };
  MOCK_SUBCATEGORIAS.push(nueva);
  return nueva;
}

export function mockUpdateSubcategoria(id: number, data: SubCategoriaUpdateRequest): void {
  const sub = MOCK_SUBCATEGORIAS.find((s) => s.id === id);
  if (!sub) throw { error: 'NOT_FOUND', mensaje: 'Subcategoría no encontrada' };
  sub.nombre = data.nombre;
  if (data.idCategoria) sub.idCategoria = data.idCategoria;
}

export function mockDeleteSubcategoria(id: number): void {
  MOCK_SUBCATEGORIAS = MOCK_SUBCATEGORIAS.filter((s) => s.id !== id);
}
