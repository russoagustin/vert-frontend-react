import React, { useState, useEffect, useCallback } from 'react';
import type { Producto, PageResponse } from '../../types/api';
import { useCatalog } from '../../hooks/useCatalog';
import { deleteProducto, getProductos } from '../../api/productos';
import { useDebounce } from '../../hooks/useDebounce';
import { ProductFormModal } from './ProductFormModal';
import { ConfirmDialog } from './ConfirmDialog';
import { AdminPagination } from './AdminPagination';

export const AdminProducts: React.FC = () => {
  const { refreshCatalog, categories } = useCatalog();

  // Estados locales de filtrado, búsqueda y paginación
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(14);

  // Estados de datos y carga
  const [pageData, setPageData] = useState<PageResponse<Producto> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados de modales y acciones
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Producto | null>(null);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Debounce para la búsqueda en la API (350ms)
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Carga de productos desde la API
  const fetchAdminProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProductos({
        idCategoria: selectedCategoryId,
        idSubCategoria: selectedSubcategoryId,
        page: currentPage,
        size: pageSize,
        search: debouncedSearch,
        sort: 'id,desc',
      });
      setPageData(response);
    } catch (err) {
      console.error('Error al cargar productos en panel admin:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, selectedSubcategoryId, currentPage, pageSize, debouncedSearch]);

  // Disparar carga cuando cambian los parámetros de consulta
  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  // Manejadores de filtros
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(0);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setSelectedCategoryId(val);
    setSelectedSubcategoryId(null); // Resetear subcategoría al cambiar categoría
    setCurrentPage(0);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : null;
    setSelectedSubcategoryId(val);
    setCurrentPage(0);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Modales
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
      refreshCatalog(); // Refrescar catálogo público
      setAlertMessage(`Producto "${productToDelete.nombre}" eliminado exitosamente.`);
      setProductToDelete(null);

      // Si se elimina el último elemento en una página > 0, retroceder de página
      if (pageData && pageData.content.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchAdminProducts();
      }
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

  // Subcategorías de la categoría seleccionada actualmente
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const availableSubcategories = activeCategory?.subcategorias || [];
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategoryId !== null || selectedSubcategoryId !== null);

  return (
    <div>
      {/* Encabezado de la vista con contador y botón de alta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.2rem',
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

      {/* Barra de herramientas: Búsqueda por nombre y Filtro por categoría */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-row">
          {/* Barra de Búsqueda por Nombre */}
          <div className="admin-search-wrapper">
            <span className="admin-search-icon">&gt;</span>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Buscar producto por nombre..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Buscar producto por nombre"
            />
            {searchQuery && (
              <button
                type="button"
                className="admin-clear-btn"
                onClick={handleClearSearch}
                title="Limpiar búsqueda"
                aria-label="Limpiar búsqueda"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filtro por Categoría */}
          <div className="admin-filter-group">
            <label htmlFor="adminCatFilter" className="admin-filter-label">
              CATEGORÍA:
            </label>
            <select
              id="adminCatFilter"
              className="admin-filter-select"
              value={selectedCategoryId ?? ''}
              onChange={handleCategoryChange}
            >
              <option value="">[TODAS LAS CATEGORÍAS]</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Subcategoría (condicional a la categoría seleccionada) */}
          {selectedCategoryId !== null && availableSubcategories.length > 0 && (
            <div className="admin-filter-group">
              <label htmlFor="adminSubcatFilter" className="admin-filter-label">
                SUBCATEGORÍA:
              </label>
              <select
                id="adminSubcatFilter"
                className="admin-filter-select"
                value={selectedSubcategoryId ?? ''}
                onChange={handleSubcategoryChange}
              >
                <option value="">[TODAS LAS SUBCATEGORÍAS]</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botón para restablecer todos los filtros */}
          {hasActiveFilters && (
            <button
              type="button"
              className="admin-reset-filters-btn"
              onClick={handleResetFilters}
              title="Restablecer todos los filtros"
            >
              [LIMPIAR_FILTROS &times;]
            </button>
          )}
        </div>
      </div>

      {/* Alerta de acción completada */}
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

      {/* Tabla de Productos */}
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
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  &gt; CARGANDO_DATOS...
                </td>
              </tr>
            ) : !pageData || pageData.content.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  {hasActiveFilters ? (
                    <div>
                      <p style={{ marginBottom: '0.8rem', color: 'var(--accent-alert)' }}>
                        &gt; NO_SE_ENCONTRARON_PRODUCTOS_CON_LOS_FILTROS_APLICADOS
                      </p>
                      <button
                        type="button"
                        className="admin-reset-filters-btn"
                        onClick={handleResetFilters}
                      >
                        [RESTAURAR_CATÁLOGO_COMPLETO]
                      </button>
                    </div>
                  ) : (
                    <p>&gt; NO_HAY_PRODUCTOS_REGISTRADOS</p>
                  )}
                </td>
              </tr>
            ) : (
              pageData.content.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    {prod.imgUrl ? (
                      <img src={prod.imgUrl} alt={prod.nombre} className="table-thumb" />
                    ) : (
                      <div
                        className="table-thumb"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
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

      {/* Controles de Paginación */}
      {pageData && pageData.totalElements > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={pageData.totalPages}
          totalElements={pageData.totalElements}
          pageSize={pageSize}
          pageSizeOptions={[10, 14, 25, 50]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      )}

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
          fetchAdminProducts();
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
