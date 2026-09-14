import React, { useState } from 'react';
import type { SubCategoria } from '../../types/api';
import { useCatalog } from '../../hooks/useCatalog';
import {
  createSubcategoria,
  updateSubcategoria,
  deleteSubcategoria,
} from '../../api/subcategorias';
import { ConfirmDialog } from './ConfirmDialog';

export const AdminSubcategories: React.FC = () => {
  const { categories, refreshCatalog } = useCatalog();

  const [selectedCatId, setSelectedCatId] = useState<number | ''>(categories[0]?.id ?? '');
  const [nombreNueva, setNombreNueva] = useState('');

  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [editingNombre, setEditingNombre] = useState('');

  const [subToDelete, setSubToDelete] = useState<SubCategoria | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista plana de todas las subcategorías con nombre de su categoría padre
  const allSubcategories = categories.flatMap((cat) =>
    cat.subcategorias.map((sub) => ({
      ...sub,
      nombreCategoriaPadre: cat.nombre,
    }))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !nombreNueva.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await createSubcategoria({
        idCategoria: Number(selectedCatId),
        nombre: nombreNueva.trim(),
      });
      setNombreNueva('');
      setSuccessMsg('Subcategoría creada exitosamente.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(err?.mensaje || 'Error al crear subcategoría.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (sub: SubCategoria) => {
    setEditingSubId(sub.id);
    setEditingNombre(sub.nombre);
  };

  const handleSaveEdit = async (id: number, idCategoria: number) => {
    if (!editingNombre.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await updateSubcategoria(id, {
        idCategoria,
        nombre: editingNombre.trim(),
      });
      setEditingSubId(null);
      setSuccessMsg('Subcategoría actualizada.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(err?.mensaje || 'Error al actualizar subcategoría.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!subToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteSubcategoria(subToDelete.id);
      setSubToDelete(null);
      setSuccessMsg('Subcategoría eliminada.');
      refreshCatalog();
    } catch (err: any) {
      setErrorMsg(err?.mensaje || 'Error al eliminar subcategoría.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-blue)', marginBottom: '1.5rem', letterSpacing: '1px' }}>
        &gt; GESTIÓN_DE_SUBCATEGORÍAS
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

      {/* Formulario rápido para crear subcategoría */}
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
        <div style={{ minWidth: '220px' }}>
          <select
            className="admin-select"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(Number(e.target.value))}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                Categoría Padre: {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Nombre de subcategoría (ej: Acero Quirúrgico, Plata 925...)"
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
          {isSubmitting ? '[CREANDO...]' : '[+ CREAR SUBCATEGORÍA]'}
        </button>
      </form>

      {/* Tabla de subcategorías */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría Padre</th>
              <th>Orden</th>
              <th>Nombre de Subcategoría</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allSubcategories.map((sub) => {
              const isEditing = editingSubId === sub.id;

              return (
                <tr key={sub.id}>
                  <td>#{sub.id}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(2, 62, 138, 0.3)',
                        borderRadius: '3px',
                        border: '1px solid var(--secondary-blue)',
                        color: 'var(--primary-blue)',
                      }}
                    >
                      {sub.nombreCategoriaPadre}
                    </span>
                  </td>
                  <td>{sub.orden}</td>
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
                      <span style={{ fontWeight: 'bold', color: '#fff' }}>{sub.nombre}</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {isEditing ? (
                        <>
                          <button
                            className="action-btn action-btn-edit"
                            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
                            onClick={() => handleSaveEdit(sub.id, sub.idCategoria)}
                          >
                            [GUARDAR]
                          </button>
                          <button
                            className="action-btn"
                            style={{ border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}
                            onClick={() => setEditingSubId(null)}
                          >
                            [CANCELAR]
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="action-btn action-btn-edit"
                            onClick={() => handleStartEdit(sub)}
                          >
                            [RENOMBRAR]
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={() => setSubToDelete(sub)}
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
        isOpen={Boolean(subToDelete)}
        title="ELIMINAR_SUBCATEGORÍA"
        message={`¿Estás seguro de que deseas eliminar la subcategoría "${subToDelete?.nombre}"?`}
        onConfirm={handleDelete}
        onCancel={() => setSubToDelete(null)}
        confirmText="[ELIMINAR_SUBCATEGORÍA]"
      />
    </div>
  );
};
