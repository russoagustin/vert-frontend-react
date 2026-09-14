import React from 'react';

interface LoadingTerminalProps {
  message?: string;
}

export const LoadingTerminal: React.FC<LoadingTerminalProps> = ({
  message = 'QUERYING_DATABASE...',
}) => {
  return (
    <div style={{ padding: '3rem 1rem', textAlign: 'center', width: '100%' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          color: 'var(--primary-blue)',
          fontSize: '1.2rem',
          textShadow: 'var(--text-glow)',
        }}
      >
        <span>&gt; {message}</span>
        <span className="cursor"></span>
      </div>
    </div>
  );
};
