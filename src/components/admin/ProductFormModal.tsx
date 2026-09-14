import React, { useState } from 'react';
import type { Producto, ProductoCreateRequest, ProductoUpdateRequest } from '../../types/api';
import { useCatalog } from '../../hooks/useCatalog';
import { createProducto, updateProducto } from '../../api/productos';
import { formatErrorMessage } from '../../api/errors';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Producto | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductFormContentProps {
  productToEdit?: Producto | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductFormContent: React.FC<ProductFormContentProps> = ({
  productToEdit,
  onClose,
  onSuccess,
}) => {
  const { categories, refreshCatalog } = useCatalog();

  const [nombre, setNombre] = useState(productToEdit?.nombre ?? '');
  const [idCategoria, setIdCategoria] = useState<number | ''>(
    productToEdit?.idCategoria ?? categories[0]?.id ?? ''
  );
  const [idSubCategoria, setIdSubCategoria] = useState<number | ''>(
    productToEdit?.idSubCategoria ?? categories[0]?.subcategorias[0]?.id ?? ''
  );
  const [precio, setPrecio] = useState<number | ''>(productToEdit?.precio ?? '');
  const [precioDescuento, setPrecioDescuento] = useState<number | ''>(
    productToEdit?.precioDescuento ?? ''
  );
  const [cantidad, setCantidad] = useState<number | ''>(productToEdit?.cantidad ?? '');
  const [descripcion, setDescripcion] = useState(productToEdit?.descripcion ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(productToEdit?.imgUrl || null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Si cambia la categoría seleccionada, ajustar subcategorías disponibles
  const availableSubcategories =
    categories.find((c) => c.id === Number(idCategoria))?.subcategorias || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = Number(e.target.value);
    setIdCategoria(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subcategorias.length > 0) {
      setIdSubCategoria(cat.subcategorias[0].id);
    } else {
      setIdSubCategoria('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validaciones
    if (!nombre.trim()) {
      setFormError('El nombre del producto no puede estar vacío.');
      return;
    }
    if (idCategoria === '' || idSubCategoria === '') {
      setFormError('Debes seleccionar una categoría y subcategoría.');
      return;
    }
    if (precio === '' || Number(precio) < 0) {
      setFormError('El precio debe ser un número mayor o igual a 0.');
      return;
    }

    const numPrecio = Number(precio);
    const numDescuento = precioDescuento !== '' ? Number(precioDescuento) : null;

    if (numDescuento !== null) {
      if (numDescuento < 0) {
        setFormError('El precio de descuento debe ser mayor o igual a 0.');
        return;
      }
      if (numDescuento > numPrecio) {
        setFormError('El precio de descuento no puede ser mayor al precio regular.');
        return;
      }
    }

    if (!productToEdit && !imageFile) {
      setFormError('La imagen del producto es obligatoria al dar de alta un producto.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (productToEdit) {
        const updateData: ProductoUpdateRequest = {
          idCategoria: Number(idCategoria),
          idSubCategoria: Number(idSubCategoria),
          nombre: nombre.trim(),
          precio: numPrecio,
          precioDescuento: numDescuento,
          descripcion: descripcion.trim() || null,
          cantidad: cantidad !== '' ? Number(cantidad) : null,
        };
        await updateProducto(productToEdit.id, updateData, imageFile || undefined);
      } else {
        const createData: ProductoCreateRequest = {
          idCategoria: Number(idCategoria),
          idSubCategoria: Number(idSubCategoria),
          nombre: nombre.trim(),
          precio: numPrecio,
          precioDescuento: numDescuento,
          descripcion: descripcion.trim() || null,
          cantidad: cantidad !== '' ? Number(cantidad) : null,
        };
        await createProducto(createData, imageFile || undefined);
      }

      refreshCatalog();
      onSuccess();
      onClose();
    } catch (err: any) {
      setFormError(formatErrorMessage(err, 'Error al guardar el producto.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-window"
      style={{ maxWidth: '680px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <span className="modal-header-title">
          &gt; {productToEdit ? `EDITAR_PRODUCTO // ID: #${productToEdit.id}` : 'ALTA_NUEVO_PRODUCTO'}
        </span>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
        {formError && (
          <div className="alert-box alert-error">
            <span>[ERROR]:</span>
            <span>{formError}</span>
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-form-label">&gt; NOMBRE_DEL_PRODUCTO *</label>
          <input
            type="text"
            className="admin-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Collar Acero Quirúrgico Corazón"
            required
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">&gt; CATEGORÍA *</label>
            <select
              className="admin-select"
              value={idCategoria}
              onChange={handleCategoryChange}
              required
            >
              <option value="">-- Seleccionar Categoría --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">&gt; SUBCATEGORÍA *</label>
            <select
              className="admin-select"
              value={idSubCategoria}
              onChange={(e) => setIdSubCategoria(Number(e.target.value))}
              required
              disabled={availableSubcategories.length === 0}
            >
              <option value="">-- Seleccionar Subcategoría --</option>
              {availableSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">&gt; PRECIO_REGULAR ($ARS) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="admin-input"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ej: 3500.00"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">&gt; PRECIO_OFERTA ($ARS, OPCIONAL)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="admin-input"
              value={precioDescuento}
              onChange={(e) =>
                setPrecioDescuento(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Debe ser menor al precio regular"
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-form-label">&gt; STOCK_DISPONIBLE (UNIDADES)</label>
            <input
              type="number"
              min="0"
              className="admin-input"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Ej: 15"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              &gt; FOTO_PRODUCTO {productToEdit ? '(OPCIONAL REEMPLAZO)' : '* (OBLIGATORIA)'}
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="admin-input"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {previewUrl && (
          <div className="image-preview-box">
            <img src={previewUrl} alt="Preview" className="image-preview-img" />
          </div>
        )}

        <div className="admin-form-group">
          <label className="admin-form-label">&gt; DESCRIPCIÓN_DEL_PRODUCTO</label>
          <textarea
            className="admin-textarea"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles sobre materiales, medidas, color o terminación..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            className="terminal-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            [CANCELAR]
          </button>
          <button
            type="submit"
            className="terminal-btn"
            style={{
              borderColor: 'var(--accent-green)',
              color: 'var(--accent-green)',
              backgroundColor: 'rgba(0, 255, 102, 0.1)',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? '[GUARDANDO...]'
              : productToEdit
              ? '[GUARDAR_CAMBIOS]'
              : '[CREAR_PRODUCTO]'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <ProductFormContent
        key={productToEdit?.id ?? 'new'}
        productToEdit={productToEdit}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
};
