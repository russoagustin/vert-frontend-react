import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { CatalogPage } from '../pages/public/CatalogPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminSubcategories } from '../components/admin/AdminSubcategories';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ErrorPage } from '../pages/error/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // 1. Zona Pública: Catálogo accesible para cualquier visitante
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <CatalogPage />,
          },
        ],
      },

      // 2. Ruta de Autenticación: Formulario de ingreso con redirección inteligente
      {
        path: 'login',
        element: <LoginPage />,
      },

      // 3. Zona Privada de Administración: Protegida por Auth Guard
      {
        path: 'gestion',
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="productos" replace />,
              },
              {
                path: 'productos',
                element: <AdminProducts />,
              },
              {
                path: 'categorias',
                element: <AdminCategories />,
              },
              {
                path: 'subcategorias',
                element: <AdminSubcategories />,
              },
            ],
          },
        ],
      },

      // 4. Fallback: Página 404 ante rutas no registradas
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
