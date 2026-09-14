import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();

  let errorMessage = 'Ocurrió una excepción inesperada durante el renderizado.';
  let statusCode = '500';

  if (isRouteErrorResponse(error)) {
    statusCode = String(error.status);
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="login-screen-wrapper">
      <div className="login-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div className="login-card-header">
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-alert)', letterSpacing: '3px', marginBottom: '0.5rem' }}>
            SYS_FAULT // {statusCode}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-cyan)' }}>
            ERROR_EN_TIEMPO_DE_EJECUCIÓN
          </p>
        </div>

        <div className="alert-box alert-error" style={{ margin: '1.5rem 0', textAlign: 'left' }}>
          <span>[DETALLE]:</span>
          <span>{errorMessage}</span>
        </div>

        <Link
          to={ROUTES.HOME}
          className="terminal-btn"
          style={{
            display: 'inline-flex',
            width: '100%',
            justifyContent: 'center',
            padding: '0.75rem',
            borderColor: 'var(--primary-blue)',
            fontWeight: 'bold',
          }}
        >
          &lt; REINICIAR Y VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
