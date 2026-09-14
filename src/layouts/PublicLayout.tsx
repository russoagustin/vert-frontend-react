import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { ProductDetailModal } from '../components/catalog/ProductDetailModal';

export const PublicLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ProductDetailModal />
    </div>
  );
};
