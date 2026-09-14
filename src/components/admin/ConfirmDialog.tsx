import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '[CONFIRMAR // ELIMINAR]',
  cancelText = '[CANCELAR]',
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div
        className="modal-window"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ borderColor: 'var(--accent-alert)' }}>
          <span className="modal-header-title" style={{ color: 'var(--accent-alert)' }}>
            &gt; ALERTA: {title}
          </span>
          <button className="close-btn" onClick={onCancel}>
            &times;
          </button>
        </div>

        <div style={{ padding: '1.5rem', color: '#fff' }}>
          <p style={{ lineHeight: 1.5, marginBottom: '1.5rem', color: '#c2d6eb' }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              className="terminal-btn"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="terminal-btn"
              style={{
                borderColor: 'var(--accent-alert)',
                color: 'var(--accent-alert)',
                backgroundColor: 'rgba(255, 51, 102, 0.1)',
              }}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
