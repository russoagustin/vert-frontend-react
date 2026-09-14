import React, { useState, useEffect } from 'react';
import { useCatalog } from '../../hooks/useCatalog';

export const Sidebar: React.FC = () => {
  const {
    categories,
    selectedCategoryId,
    selectedSubcategoryId,
    isMenuOpen,
    closeMenu,
    selectCategory,
    isLoadingCategories,
  } = useCatalog();

  // Estado para controlar qué categorías están expandidas o colapsadas manualmente
  const [collapsedCategories, setCollapsedCategories] = useState<Record<number, boolean>>({});

  // Manejador para cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  const toggleCategoryAccordion = (catId: number, currentlyExpanded: boolean) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: currentlyExpanded,
    }));
  };

  return (
    <>
      {/* Fondo oscurecido con desenfoque */}
      <div
        className={`overlay ${isMenuOpen ? 'active' : ''}`}
        id="overlay"
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Menú lateral estilo terminal */}
      <aside
        className={`sidebar ${isMenuOpen ? 'open' : ''}`}
        id="sidebar"
        aria-label="Navegación de categorías"
      >
        <div className="sidebar-header">
          <span className="sidebar-title">&gt; ÍNDICE_CATÁLOGO</span>
          <button
            className="close-btn"
            id="closeMenuBtn"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            &times;
          </button>
        </div>

        <ul className="category-list" id="categoryList">
          {isLoadingCategories ? (
            <li style={{ color: 'var(--text-muted)', padding: '1rem' }}>
              &gt; CARGANDO_CATEGORÍAS...
            </li>
          ) : (
            categories.map((cat) => {
              const isExpanded =
                collapsedCategories[cat.id] !== undefined
                  ? !collapsedCategories[cat.id]
                  : selectedCategoryId === cat.id;
              const isCategoryActive = selectedCategoryId === cat.id;

              return (
                <li
                  key={cat.id}
                  className={`category-item ${isCategoryActive ? 'active-category' : ''}`}
                >
                  <div
                    className={`category-title ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleCategoryAccordion(cat.id, isExpanded)}
                  >
                    <div className="category-title-left">
                      <span className={`arrow-indicator ${isExpanded ? 'rotated' : ''}`}>
                        &gt;
                      </span>
                      <span>{cat.nombre}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      [{cat.subcategorias.length}]
                    </span>
                  </div>

                  <ul className={`subcategory-list ${isExpanded ? 'active' : ''}`}>
                    {cat.subcategorias.map((sub) => {
                      const isSubSelected =
                        isCategoryActive && selectedSubcategoryId === sub.id;

                      return (
                        <li
                          key={sub.id}
                          className={`subcategory-item ${isSubSelected ? 'selected' : ''}`}
                          onClick={() => {
                            selectCategory(cat.id, sub.id, `${cat.nombre} > ${sub.nombre}`);
                            closeMenu();
                          }}
                        >
                          - {sub.nombre}
                        </li>
                      );
                    })}

                    <li>
                      <button
                        className="view-all-btn"
                        onClick={() => {
                          selectCategory(cat.id, null, cat.nombre);
                          closeMenu();
                        }}
                      >
                        [Ver todo en {cat.nombre}]
                      </button>
                    </li>
                  </ul>
                </li>
              );
            })
          )}
        </ul>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px dashed var(--secondary-blue)' }}>
          <button
            className="view-all-btn"
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
            onClick={() => {
              selectCategory(null, null, 'Catálogo Completo');
              closeMenu();
            }}
          >
            &gt; MOSTRAR TODO EL CATÁLOGO
          </button>
        </div>
      </aside>
    </>
  );
};
