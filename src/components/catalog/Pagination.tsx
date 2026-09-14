import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';

export const Pagination: React.FC = () => {
  const { pageData, currentPage, goToPage } = useCatalog();

  if (!pageData || pageData.totalPages <= 1) {
    return null;
  }

  const { totalPages, first, last } = pageData;

  return (
    <nav className="pagination-container" aria-label="Navegación de páginas">
      <button
        className="terminal-btn"
        disabled={first}
        onClick={() => goToPage(0)}
        aria-label="Ir a la primera página"
      >
        [&lt;&lt; PRIMERA]
      </button>

      <button
        className="terminal-btn"
        disabled={first}
        onClick={() => goToPage(currentPage - 1)}
        aria-label="Página anterior"
      >
        [&lt; ANTERIOR]
      </button>

      <div className="page-indicator">
        PÁG. {currentPage + 1} DE {totalPages}
      </div>

      <button
        className="terminal-btn"
        disabled={last}
        onClick={() => goToPage(currentPage + 1)}
        aria-label="Página siguiente"
      >
        [SIGUIENTE &gt;]
      </button>

      <button
        className="terminal-btn"
        disabled={last}
        onClick={() => goToPage(totalPages - 1)}
        aria-label="Ir a la última página"
      >
        [ÚLTIMA &gt;&gt;]
      </button>
    </nav>
  );
};
