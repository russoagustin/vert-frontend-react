import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

interface AdminLoginProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login, isLoading, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Recupera la ruta previa a la redirección o utiliza /gestion/productos por defecto
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const redirectDestination = fromLocation || ROUTES.GESTION.PRODUCTOS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!username.trim() || !password) return;

    try {
      await login({ username: username.trim(), password });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectDestination, { replace: true });
      }
    } catch {
      // El error ya es capturado y guardado en authError por AuthContext
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        <div className="login-card-header">
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-blue)', letterSpacing: '2px', marginBottom: '0.5rem' }}>
            TERMINAL_AUTH // VERT
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ACCESO RESTRINGIDO AL PANEL DE GESTIÓN
          </p>
        </div>

        {authError && (
          <div className="alert-box alert-error">
            <span>[FALLO]:</span>
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">&gt; NOMBRE_DE_USUARIO:</label>
            <input
              type="text"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario administrador"
              required
              autoFocus
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: '1.8rem' }}>
            <label className="admin-form-label">&gt; CONTRASEÑA_DE_ACCESO:</label>
            <input
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              type="submit"
              className="terminal-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.7rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderColor: 'var(--primary-blue)',
                boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
              }}
              disabled={isLoading}
            >
              {isLoading ? '[AUTENTICANDO...]' : '[AUTENTICAR // INGRESAR]'}
            </button>

            <button
              type="button"
              className="terminal-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                borderColor: 'var(--secondary-blue)',
                color: 'var(--text-muted)',
              }}
              onClick={handleCancel}
              disabled={isLoading}
            >
              &lt; VOLVER AL CATÁLOGO PÚBLICO
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Tip: En modo de prueba sin backend, puedes ingresar con usuario <code>admin</code> y clave <code>admin</code> o <code>admin123</code>.
        </div>
      </div>
    </div>
  );
};
