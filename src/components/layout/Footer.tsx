import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';
export const Footer: React.FC = () => {
  const { isOfflineMode } = useCatalog();

  return (
    <footer className="catalog-footer">
      <div>
        <span>&gt; VERT_CATALOG_SYS</span>
      </div>

      {isOfflineMode && (
        <div className="system-status">
          <span className="status-dot demo"></span>
          <span>MODO DEMO ACTIVO (SIMULADOR STANDALONE)</span>
        </div>
      )}
    </footer>
  );
};
