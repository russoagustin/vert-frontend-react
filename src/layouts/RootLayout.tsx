import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CatalogProvider } from '../context/CatalogContext';

export const RootLayout: React.FC = () => {
  return (
    <AuthProvider>
      <CatalogProvider>
        <div className="app-root">
          <Outlet />
        </div>
      </CatalogProvider>
    </AuthProvider>
  );
};
