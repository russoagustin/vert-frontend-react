export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  GESTION: {
    ROOT: '/gestion',
    PRODUCTOS: '/gestion/productos',
    CATEGORIAS: '/gestion/categorias',
    SUBCATEGORIAS: '/gestion/subcategorias',
  },
} as const;

export type AppRoutes = typeof ROUTES;
