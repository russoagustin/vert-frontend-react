import React from 'react';

interface TerminalBadgeProps {
  type: 'offer' | 'stock' | 'out-of-stock';
  children: React.ReactNode;
}

export const TerminalBadge: React.FC<TerminalBadgeProps> = ({ type, children }) => {
  let className = 'badge ';
  if (type === 'offer') className += 'badge-offer';
  if (type === 'stock') className += 'badge-stock';
  if (type === 'out-of-stock') className += 'badge-out-of-stock';

  return <span className={className}>{children}</span>;
};
