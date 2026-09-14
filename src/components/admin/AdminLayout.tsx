import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

interface AdminLayoutProps {
  onBackToCatalog?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToCatalog }) => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onBackToCatalog) {
      onBackToCatalog();
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="admin-container">
      {/* Barra superior de administración */}
      <div className="admin-header-bar">
        <div className="admin-title-area">
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-blue)', letterSpacing: '2px' }}>
            VERT // PANEL_ADMINISTRATIVO
          </h2>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent-green)',
              background: 'rgba(0, 255, 102, 0.1)',
              border: '1px solid var(--accent-green)',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
            }}
          >
            SYS_OP: {username || 'ADMIN'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <Link
            to={ROUTES.HOME}
            className="terminal-btn"
          >
            &lt; IR AL CATÁLOGO
          </Link>
          <button
            type="button"
            className="terminal-btn"
            style={{
              borderColor: 'var(--accent-alert)',
              color: 'var(--accent-alert)',
            }}
            onClick={handleLogout}
          >
            [CERRAR_SESIÓN]
          </button>
        </div>
      </div>

      {/* Pestañas de navegación de módulos con react-router */}
      <nav className="admin-tabs" aria-label="Navegación del panel administrativo">
        <NavLink
          to={ROUTES.GESTION.PRODUCTOS}
          className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
        >
          [1] PRODUCTOS
        </NavLink>
        <NavLink
          to={ROUTES.GESTION.CATEGORIAS}
          className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
        >
          [2] CATEGORÍAS
        </NavLink>
        <NavLink
          to={ROUTES.GESTION.SUBCATEGORIAS}
          className={({ isActive }) => `admin-tab-btn ${isActive ? 'active' : ''}`}
        >
          [3] SUBCATEGORÍAS
        </NavLink>
      </nav>

      {/* Renderizado dinámico de la subruta activa */}
      <main className="admin-content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
