import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="login-screen-wrapper">
      <div className="login-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div className="login-card-header">
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-alert)', letterSpacing: '3px', marginBottom: '0.5rem' }}>
            ERR // 404
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-cyan)', letterSpacing: '1px' }}>
            SECTOR_NO_ENCONTRADO // RUTA_INVÁLIDA
          </p>
        </div>

        <div className="alert-box alert-error" style={{ margin: '1.5rem 0', textAlign: 'left' }}>
          <span>[DIAGNÓSTICO]:</span>
          <span>La dirección solicitada no existe o ha sido reubicada en el sistema.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <Link
            to={ROUTES.HOME}
            className="terminal-btn"
            style={{
              justifyContent: 'center',
              padding: '0.75rem',
              fontWeight: 'bold',
              borderColor: 'var(--primary-blue)',
            }}
          >
            &lt; VOLVER AL CATÁLOGO PRINCIPAL
          </Link>
          <Link
            to={ROUTES.GESTION.ROOT}
            className="terminal-btn"
            style={{
              justifyContent: 'center',
              color: 'var(--text-muted)',
              borderColor: 'var(--secondary-blue)',
            }}
          >
            [ ACCEDER AL PANEL DE GESTIÓN ]
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
