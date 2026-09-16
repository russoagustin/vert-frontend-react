import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';

export const FilterBar: React.FC = () => {
  const {
    sortOption,
    setSortOption,
  } = useCatalog();

  const isSortChanged = sortOption !== 'id,desc';

  return (
    <div className="filter-bar">
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
          <option value="id,desc">Por defecto (Novedades)</option>
          <option value="precio,asc">Precio: Menor a Mayor</option>
          <option value="precio,desc">Precio: Mayor a Menor</option>
          <option value="nombre,asc">Nombre: A - Z</option>
        </select>
      </div>

      {isSortChanged && (
        <button
          className="clear-filter-btn"
          onClick={() => setSortOption('id,desc')}
          title="Restablecer orden por defecto"
        >
          [LIMPIAR_FILTROS &times;]
        </button>
      )}
    </div>
  );
};
