import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    resetFilters,
    selectedCategoryId,
    selectedSubcategoryId,
    pageData,
  } = useCatalog();

  const isFiltered = Boolean(
    selectedCategoryId !== null ||
    selectedSubcategoryId !== null ||
    searchQuery.trim() !== '' ||
    sortOption !== 'id,asc'
  );

  return (
    <div className="filter-bar">
      <div className="search-input-group">
        <span className="search-prompt">&gt; BUSCAR:</span>
        <input
          type="text"
          className="search-input"
          placeholder="Nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar productos por nombre"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-main)',
              fontSize: '1rem',
              padding: '0 0.3rem',
            }}
            title="Borrar búsqueda"
          >
            &times;
          </button>
        )}
      </div>

      <div className="sort-select-group">
        <label htmlFor="sortSelect" className="sort-label">
          [ORDEN]:
        </label>
        <select
          id="sortSelect"
          className="sort-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="id,asc">Por defecto (Novedades)</option>
          <option value="precio,asc">Precio: Menor a Mayor</option>
          <option value="precio,desc">Precio: Mayor a Menor</option>
          <option value="nombre,asc">Nombre: A - Z</option>
        </select>
      </div>

      {isFiltered && (
        <button
          className="clear-filter-btn"
          onClick={resetFilters}
          title="Limpiar todos los filtros"
        >
          [LIMPIAR_FILTROS &times;]
        </button>
      )}

      {pageData && (
        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          TOTAL: {pageData.totalElements} ÍTEMS
        </div>
      )}
    </div>
  );
};
