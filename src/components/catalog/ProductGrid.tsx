import React from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { ProductCard } from './ProductCard';
import { LoadingTerminal } from '../common/LoadingTerminal';

export const ProductGrid: React.FC = () => {
  const {
    pageData,
    isLoadingProducts,
    currentSectionTitle,
    selectedCategoryId,
    selectedSubcategoryId,
    categories,
  } = useCatalog();

  // Obtener ruta de navegación para el breadcrumb terminal
  const currentCategory = categories.find((c) => c.id === selectedCategoryId);
  const currentSubcategory = currentCategory?.subcategorias.find(
    (s) => s.id === selectedSubcategoryId
  );

  return (
    <section>
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="system-breadcrumb">
            SYS://VERT
            {currentCategory ? `/${currentCategory.nombre.toUpperCase()}` : '/TODO'}
            {currentSubcategory ? `/${currentSubcategory.nombre.toUpperCase()}` : ''}
          </div>
          <h2 className="section-title">
            &gt; {currentSectionTitle}
            <span className="cursor"></span>
          </h2>
        </div>
      </div>

      {isLoadingProducts ? (
        <LoadingTerminal message="QUERYING_PRODUCT_DATABASE..." />
      ) : !pageData || pageData.content.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            border: '1px dashed var(--secondary-blue)',
            borderRadius: '6px',
            backgroundColor: 'rgba(2, 62, 138, 0.1)',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
            &gt; DATA_NOT_FOUND
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            No se encontraron productos coincidentes con los parámetros especificados.
          </p>
        </div>
      ) : (
        <div className="products-grid" id="productsGrid">
          {pageData.content.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
