import React, { useState } from 'react';
import type { Categoria } from '../../types/api';
import { useCatalog } from '../../hooks/useCatalog';
import { createCategoria, updateCategoria, deleteCategoria } from '../../api/categorias';
import { formatErrorMessage } from '../../api/errors';
import { ConfirmDialog } from './ConfirmDialog';

export const AdminCategories: React.FC = () => {
  const { categories, refreshCatalog } = useCatalog();

  const [nombreNueva, setNombreNueva] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingNombre, setEditingNombre] = useState('');

  const [catToDelete, setCatToDelete] = useState<Categoria | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreNueva.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createCategoria({ nombre: nombreNueva.trim() });
      setNombreNueva('');
      setSuccessMsg('Categoría creada exitosamente.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(formatErrorMessage(err, 'Error al crear categoría.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (cat: Categoria) => {
    setEditingCatId(cat.id);
    setEditingNombre(cat.nombre);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingNombre.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await updateCategoria(id, { nombre: editingNombre.trim() });
      setEditingCatId(null);
      setSuccessMsg('Categoría actualizada.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(formatErrorMessage(err, 'Error al actualizar categoría.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!catToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCategoria(catToDelete.id);
      setCatToDelete(null);
      setSuccessMsg('Categoría eliminada.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(formatErrorMessage(err, 'Error al eliminar categoría.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-blue)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
        &gt; GESTIÓN_DE_CATEGORÍAS
      </h3>

      {errorMsg && (
        <div className="alert-box alert-error">
          <span>[ERROR]:</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-box alert-success">
          <span>&gt; {successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Formulario rápido para crear categoría */}
      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          background: 'rgba(2, 62, 138, 0.15)',
          padding: '1rem',
          borderRadius: '6px',
          border: '1px solid var(--secondary-blue)',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Nombre de nueva categoría (ej: Pulseras, Relojes...)"
            value={nombreNueva}
            onChange={(e) => setNombreNueva(e.target.value)}
            required
          />
        </div>
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
          {isSubmitting ? '[CREANDO...]' : '[+ CREAR CATEGORÍA]'}
        </button>
      </form>

      {/* Tabla de categorías */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Orden</th>
              <th>Nombre de Categoría</th>
              <th>Subcategorías vinculadas</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const isEditing = editingCatId === cat.id;

              return (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td>{cat.orden}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="admin-input"
                        value={editingNombre}
                        onChange={(e) => setEditingNombre(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span style={{ fontWeight: 'bold', color: '#fff' }}>{cat.nombre}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {cat.subcategorias.length > 0
                        ? cat.subcategorias.map((s) => s.nombre).join(', ')
                        : '(Sin subcategorías)'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {isEditing ? (
                        <>
                          <button
                            className="action-btn action-btn-edit"
                            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
                            onClick={() => handleSaveEdit(cat.id)}
                          >
                            [GUARDAR]
                          </button>
                          <button
                            className="action-btn"
                            style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}
                            onClick={() => setEditingCatId(null)}
                          >
                            [CANCELAR]
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => handleStartEdit(cat)}
                          >
                            [RENOMBRAR]
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => setCatToDelete(cat)}
                          >
                            [BORRAR]
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={Boolean(catToDelete)}
        title="ELIMINAR_CATEGORÍA"
        message={`¿Estás seguro de que deseas eliminar la categoría "${catToDelete?.nombre}" y todas sus subcategorías asociadas?`}
        onConfirm={handleDelete}
        onCancel={() => setCatToDelete(null)}
        confirmText="[ELIMINAR_CATEGORÍA]"
      />
    </div>
  );
};
