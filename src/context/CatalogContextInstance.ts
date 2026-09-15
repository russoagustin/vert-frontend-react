import { createContext } from 'react';
import type { Producto, PageResponse, CategoriaConSubcategorias } from '../types/api';

export interface CatalogContextType {
  categories: CategoriaConSubcategorias[];
  selectedCategoryId: number | null;
  selectedSubcategoryId: number | null;
  currentSectionTitle: string;
  searchQuery: string;
  sortOption: string;
  currentPage: number;
  pageSize: number;
  pageData: PageResponse<Producto> | null;
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isMenuOpen: boolean;
  isOfflineMode: boolean;
  selectedProductForModal: Producto | null;

  // Acciones
  selectCategory: (categoryId: number | null, subcategoryId?: number | null, title?: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (sort: string) => void;
  goToPage: (page: number) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  openProductModal: (product: Producto) => void;
  closeProductModal: () => void;
  resetFilters: () => void;
  refreshCatalog: () => Promise<void> | void;
  refreshCategories: () => Promise<void> | void;
}

export const CatalogContext = createContext<CatalogContextType | undefined>(undefined);
