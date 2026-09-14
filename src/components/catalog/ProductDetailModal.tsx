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
  const currentPrice = hasDiscount && product.precioDescuento ? product.precioDescuento : product.precio;
  const isOutOfStock = product.cantidad !== null && product.cantidad <= 0;

  // Enlace para consultar por WhatsApp con mensaje pre-armado
  const whatsappMessage = encodeURIComponent(
    `Hola Vert Accesorios! Quisiera consultar sobre el producto: "${product.nombre}" (${formatPrice(currentPrice)}). ¿Tienen stock disponible?`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div
      className="modal-window"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <span className="modal-header-title">
          &gt; DETALLE_PRODUCTO // ID_{product.id}
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
              style={{ height: '280px', borderRadius: '6px' }}
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

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {hasDiscount && <TerminalBadge type="offer">PRECIO PROMOCIONAL</TerminalBadge>}
            {isOutOfStock ? (
              <TerminalBadge type="out-of-stock">SIN STOCK MOMENTÁNEO</TerminalBadge>
            ) : (
              <TerminalBadge type="stock">
                STOCK DISPONIBLE: {product.cantidad ?? 'SÍ'}
              </TerminalBadge>
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
            <p>
              {product.descripcion ||
                'Accesorio de diseño exclusivo confeccionado con materiales seleccionados de alta durabilidad.'}
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-cta-btn"
          >
            <svg
              style={{ width: '22px', height: '22px', fill: 'currentColor' }}
              viewBox="0 0 24 24"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
            </svg>
            <span>Consultar / Pedir por WhatsApp</span>
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

  if (!selectedProductForModal) return null;

  return (
    <div
      className="modal-backdrop"
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
