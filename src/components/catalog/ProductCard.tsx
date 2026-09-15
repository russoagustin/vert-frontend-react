import React, { useState } from 'react';
import type { Producto } from '../../types/api';
import { TerminalBadge } from '../common/TerminalBadge';
import { useCatalog } from '../../hooks/useCatalog';

interface ProductCardProps {
  product: Producto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProductModal } = useCatalog();
  const [imageError, setImageError] = useState<boolean>(false);

  const formatPrice = (amount: number) => {
    return '$' + Math.round(amount).toLocaleString('es-AR');
  };

  const hasDiscount = product.precioDescuento !== null && product.precioDescuento < product.precio;
  const isOutOfStock = product.cantidad !== null && product.cantidad <= 0;
  const suffix = product.suffix || '';

  return (
    <div
      className="product-card"
      onClick={() => openProductModal(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openProductModal(product);
        }
      }}
      aria-label={`Ver detalles de ${product.nombre}`}
    >
      <div className="product-image-container">
        {/* Badges de oferta y stock */}
        <div className="card-badges">
          {hasDiscount && (
            <TerminalBadge type="offer">
              OFERTA
            </TerminalBadge>
          )}
          {isOutOfStock && (
            <TerminalBadge type="out-of-stock">
              AGOTADO
            </TerminalBadge>
          )}
        </div>

        {/* Imagen del producto */}
        {!imageError && product.imgUrl ? (
          <img
            src={product.imgUrl}
            alt={product.nombre}
            className="product-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-fallback">
            <svg
              style={{ width: '40px', height: '40px', fill: 'currentColor' }}
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span>[NO_SIGNAL]</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>

        <div className="price-container">
          {hasDiscount && product.precioDescuento ? (
            <>
              <span className="price price-offer">
                {formatPrice(product.precioDescuento)}
                {suffix}
              </span>
              <span className="price-original">
                {formatPrice(product.precio)}
              </span>
            </>
          ) : (
            <span className="price">
              {formatPrice(product.precio)}
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
