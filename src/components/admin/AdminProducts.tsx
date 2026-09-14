import React, { useState } from 'react';
import type { Producto } from '../../types/api';
import { useCatalog } from '../../hooks/useCatalog';
import { deleteProducto } from '../../api/productos';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmDialog } from './ConfirmDialog';

export const AdminProducts: React.FC = () => {
  const { pageData, refreshCatalog, categories, isLoadingProducts } = useCatalog();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Producto | null>(null);

  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleEdit = (product: Producto) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProducto(productToDelete.id);
      refreshCatalog();
      setAlertMessage(`Producto "${productToDelete.nombre}" eliminado exitosamente.`);
      setProductToDelete(null);
    } catch (err: any) {
      alert('Error al eliminar producto: ' + (err?.mensaje || 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (amount: number) => {
    return '$' + Math.round(amount).toLocaleString('es-AR');
  };

  const getCategoryName = (catId: number) => {
    return categories.find((c) => c.id === catId)?.nombre || `ID ${catId}`;
  };

  const getSubcategoryName = (catId: number, subId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat?.subcategorias.find((s) => s.id === subId)?.nombre || `ID ${subId}`;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-blue)', letterSpacing: '1px' }}>
          &gt; INVENTARIO_DE_PRODUCTOS [{pageData?.totalElements || 0}]
        </h3>

        <button
          className="terminal-btn"
          style={{
            borderColor: 'var(--accent-green)',
            color: 'var(--accent-green)',
            backgroundColor: 'rgba(0, 255, 102, 0.1)',
          }}
          onClick={handleCreate}
        >
          [+ ALTA NUEVO PRODUCTO]
        </button>
      </div>

      {alertMessage && (
        <div className="alert-box alert-success">
          <span>&gt; {alertMessage}</span>
          <button
            onClick={() => setAlertMessage(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Categoría / Subcat</th>
              <th>Precio Reg.</th>
              <th>Precio Oferta</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingProducts ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  &gt; CARGANDO_DATOS...
                </td>
              </tr>
            ) : !pageData || pageData.content.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  &gt; NO_HAY_PRODUCTOS_REGISTRADOS
                </td>
              </tr>
            ) : (
              pageData.content.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    {prod.imgUrl ? (
                      <img src={prod.imgUrl} alt={prod.nombre} className="table-thumb" />
                    ) : (
                      <div className="table-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        [N/A]
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#fff' }}>
                    {prod.nombre}
                  </td>
                  <td>
                    {getCategoryName(prod.idCategoria)} / {getSubcategoryName(prod.idCategoria, prod.idSubCategoria)}
                  </td>
                  <td>{formatPrice(prod.precio)}</td>
                  <td>
                    {prod.precioDescuento ? (
                      <span style={{ color: 'var(--accent-green)', textShadow: '0 0 5px var(--accent-green)' }}>
                        {formatPrice(prod.precioDescuento)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {prod.cantidad !== null ? (
                      prod.cantidad <= 0 ? (
                        <span style={{ color: 'var(--accent-alert)' }}>AGOTADO</span>
                      ) : (
                        <span>{prod.cantidad} u.</span>
                      )
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="action-btn action-btn-edit"
                        onClick={() => handleEdit(prod)}
                        title="Modificar producto"
                      >
                        [EDITAR]
                      </button>
                      <button
                        className="action-btn action-btn-delete"
                        onClick={() => setProductToDelete(prod)}
                        title="Eliminar producto"
                      >
                        [BORRAR]
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Alta y Edición de Producto */}
      <ProductFormModal
        isOpen={isModalOpen}
        productToEdit={productToEdit}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setAlertMessage(
            productToEdit
              ? 'Producto actualizado correctamente.'
              : 'Nuevo producto agregado al catálogo con éxito.'
          );
        }}
      />

      {/* Modal de Confirmación de Borrado */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        title="ELIMINAR_PRODUCTO"
        message={`¿Estás seguro de que deseas eliminar permanentemente el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
        confirmText={isDeleting ? '[BORRANDO...]' : '[ELIMINAR_DEFINITIVAMENTE]'}
      />
    </div>
  );
};
