import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { ROUTES } from '../../router/routes';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const destination = fromLocation || ROUTES.GESTION.PRODUCTOS;

  // Si ya está autenticado, redirige al destino administrativo
  if (isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return <AdminLogin />;
};

export default LoginPage;
