import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { API_BASE_URL } from '../../api/client';

export const Footer: React.FC = () => {
  const { isOfflineMode } = useCatalog();

  return (
    <footer className="catalog-footer">
      <div>
        <span>&gt; VERT_CATALOG_SYS // EST. 2026</span>
        <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>|</span>
        <span>TODOS LOS DERECHOS RESERVADOS</span>
      </div>

      <div className="system-status">
        <span className={`status-dot ${isOfflineMode ? 'demo' : 'online'}`}></span>
        <span>
          {isOfflineMode
            ? 'MODO DEMO ACTIVO (SIMULADOR STANDALONE)'
            : `CONECTADO A BACKEND: ${API_BASE_URL}`}
        </span>
      </div>
    </footer>
  );
};
