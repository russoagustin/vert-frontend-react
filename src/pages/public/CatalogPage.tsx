import React from 'react';
import { FilterBar } from '../../components/catalog/FilterBar';
import { ProductGrid } from '../../components/catalog/ProductGrid';
import { Pagination } from '../../components/catalog/Pagination';

export const CatalogPage: React.FC = () => {
  return (
    <>
      <FilterBar />
      <ProductGrid />
      <Pagination />
    </>
  );
};

export default CatalogPage;
