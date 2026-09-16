import React, { useEffect, useState } from 'react';
import { useCatalog } from '../../hooks/useCatalog';
import { TerminalBadge } from '../common/TerminalBadge';
import type { Producto } from '../../types/api';

interface ProductDetailContentProps {
  product: Producto;
  onClose: () => void;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product, onClose }) => {
  const { categories } = useCatalog();
  const [imageError, setImageError] = useState<boolean>(false);

  const category = categories.find((c) => c.id === product.idCategoria);
  const subcategory = category?.subcategorias.find((s) => s.id === product.idSubCategoria);

  const formatPrice = (amount: number) => {
    return '$' + Math.round(amount).toLocaleString('es-AR');
  };

  const hasDiscount = product.precioDescuento !== null && product.precioDescuento < product.precio;
  const isOutOfStock = product.cantidad !== null && product.cantidad <= 0;

  return (
    <div
      className="modal-window product-detail-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <span className="modal-header-title">
          &gt; DETALLE_PRODUCTO
        </span>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Cerrar detalle"
        >
          &times;
        </button>
      </div>

      <div className="modal-body">
        {/* Columna de Imagen */}
        <div className="modal-image-col">
          <div className="modal-image-container">
            {!imageError && product.imgUrl ? (
              <img
                src={product.imgUrl}
                alt={product.nombre}
                className="modal-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="image-fallback"
                style={{ borderRadius: '6px' }}
              >
                <svg
                  style={{ width: '48px', height: '48px', fill: 'currentColor' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span>[IMAGEN_NO_DISPONIBLE]</span>
              </div>
            )}

            {(hasDiscount || isOutOfStock) && (
              <div className="card-badges">
                {hasDiscount && <TerminalBadge type="offer">PRECIO PROMOCIONAL</TerminalBadge>}
                {isOutOfStock && (
                  <TerminalBadge type="out-of-stock">SIN STOCK MOMENTÁNEO</TerminalBadge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Columna de Información y Compra */}
        <div className="modal-info-col">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            CATEGORÍA: {category?.nombre || 'General'}
            {subcategory ? ` // ${subcategory.nombre}` : ''}
          </div>

          <h3 id="modalProductTitle" className="modal-product-title">
            {product.nombre}
          </h3>

          <div className="modal-price-box">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              PRECIO FINAL
            </div>
            <div className="price-container">
              {hasDiscount && product.precioDescuento ? (
                <>
                  <span className="price price-offer" style={{ fontSize: '1.7rem' }}>
                    {formatPrice(product.precioDescuento)}
                    {product.suffix || ''}
                  </span>
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>
                    {formatPrice(product.precio)}
                  </span>
                  <span
                    style={{
                      color: 'var(--accent-green)',
                      fontSize: '0.85rem',
                      marginLeft: 'auto',
                    }}
                  >
                    Ahorrás {formatPrice(product.precio - product.precioDescuento)}
                  </span>
                </>
              ) : (
                <span className="price" style={{ fontSize: '1.7rem' }}>
                  {formatPrice(product.precio)}
                  {product.suffix || ''}
                </span>
              )}
            </div>
          </div>

          {Boolean(product.descripcion?.trim()) && (
            <div className="modal-description">
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--primary-blue)',
                  marginBottom: '0.4rem',
                  fontWeight: 'bold',
                }}
              >
                &gt; ESPECIFICACIONES_Y_DETALLES:
              </div>
              <p>{product.descripcion}</p>
            </div>
          )}

          <a
            href="https://ig.me/m/vert.accesorios"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-cta-btn"
          >
            <svg
              style={{ width: '22px', height: '22px', fill: 'currentColor' }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
            </svg>
            <span>CONSULTAR / PEDIR POR INSTAGRAM</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForModal, closeProductModal } = useCatalog();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProductForModal) {
        closeProductModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProductForModal, closeProductModal]);

  useEffect(() => {
    if (selectedProductForModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedProductForModal]);

  if (!selectedProductForModal) return null;

  return (
    <div
      className="modal-backdrop product-detail-backdrop"
      onClick={closeProductModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalProductTitle"
    >
      <ProductDetailContent
        key={selectedProductForModal.id}
        product={selectedProductForModal}
        onClose={closeProductModal}
      />
    </div>
  );
};
