import React from 'react';

interface AdminPaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  isLoading?: boolean;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  pageSizeOptions = [10, 14, 25, 50],
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  if (totalElements === 0) {
    return null;
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generar lista de páginas para mostrar
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getPageNumbers();
  const isFirst = currentPage === 0;
  const isLast = currentPage >= totalPages - 1;

  return (
    <div className="admin-pagination-wrapper" aria-label="Controles de paginación">
      {/* Información de elementos visibles */}
      <div className="admin-pagination-info">
        Mostrando <strong>{startItem}-{endItem}</strong> de <strong>{totalElements}</strong> productos | Pág.{' '}
        <strong>{currentPage + 1}</strong> de <strong>{totalPages || 1}</strong>
      </div>

      {/* Controles de navegación */}
      <div className="admin-pagination-nav">
        <button
          type="button"
          className="admin-page-btn"
          disabled={isFirst || isLoading}
          onClick={() => onPageChange(0)}
          title="Primera página"
          aria-label="Ir a la primera página"
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          className="admin-page-btn"
          disabled={isFirst || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          title="Página anterior"
          aria-label="Ir a la página anterior"
        >
          &lt;
        </button>

        {visiblePages.map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            className={`admin-page-btn ${pageNum === currentPage ? 'active' : ''}`}
            disabled={isLoading}
            onClick={() => onPageChange(pageNum)}
            aria-label={`Ir a la página ${pageNum + 1}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          type="button"
          className="admin-page-btn"
          disabled={isLast || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          title="Página siguiente"
          aria-label="Ir a la página siguiente"
        >
          &gt;
        </button>
        <button
          type="button"
          className="admin-page-btn"
          disabled={isLast || isLoading}
          onClick={() => onPageChange(totalPages - 1)}
          title="Última página"
          aria-label="Ir a la última página"
        >
          &gt;&gt;
        </button>
      </div>

      {/* Selector de tamaño de página */}
      {onPageSizeChange && (
        <div className="admin-page-size-selector">
          <label htmlFor="adminPageSize" className="admin-filter-label">
            FILAS:
          </label>
          <select
            id="adminPageSize"
            className="admin-filter-select"
            style={{ minWidth: '70px', padding: '0.35rem 0.6rem' }}
            value={pageSize}
            disabled={isLoading}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
