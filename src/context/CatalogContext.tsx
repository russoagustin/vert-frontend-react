import React, { useState, useEffect, useCallback } from 'react';
import type { Producto, PageResponse, CategoriaConSubcategorias } from '../types/api';
import { CatalogContext } from './CatalogContextInstance';
import { getCategorias } from '../api/categorias';
import { getSubcategorias } from '../api/subcategorias';
import { getProductos } from '../api/productos';
import { isBackendOffline } from '../api/client';
import { useDebounce } from '../hooks/useDebounce';

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CategoriaConSubcategorias[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>('Catálogo Completo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('id,asc');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(12);
  const [pageData, setPageData] = useState<PageResponse<Producto> | null>(null);

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Producto | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 350);

  // Carga de categorías
  const loadCategories = useCallback(async () => {
    try {
      const [cats, subs] = await Promise.all([
        getCategorias(),
        getSubcategorias(),
      ]);

      const merged: CategoriaConSubcategorias[] = cats.map((cat) => ({
        ...cat,
        subcategorias: subs.filter((sub) => sub.idCategoria === cat.id),
      }));

      setCategories(merged);
      setIsOfflineMode(isBackendOffline());
    } catch (err) {
      console.error('Error al cargar árbol de categorías:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Carga de productos
  const loadProducts = useCallback(async () => {
    try {
      const response = await getProductos({
        idCategoria: selectedCategoryId,
        idSubCategoria: selectedSubcategoryId,
        page: currentPage,
        size: pageSize,
        sort: sortOption,
        search: debouncedSearch,
      });

      setPageData(response);
      setIsOfflineMode(isBackendOffline());
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedCategoryId, selectedSubcategoryId, currentPage, pageSize, sortOption, debouncedSearch]);

  // Carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCategories]);

  // Recarga al cambiar filtros
  useEffect(() => {
    // Retrasar suavemente la bandera de carga para evitar renders en cascada síncronos
    const timer = setTimeout(() => {
      setIsLoadingProducts(true);
      loadProducts();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadProducts]);

  // Cambiar categoría y subcategoría
  const selectCategory = useCallback(
    (categoryId: number | null, subcategoryId: number | null = null, title?: string) => {
      setSelectedCategoryId(categoryId);
      setSelectedSubcategoryId(subcategoryId);
      setCurrentPage(0);

      if (title) {
        setCurrentSectionTitle(title);
      } else if (!categoryId) {
        setCurrentSectionTitle('Catálogo Completo');
      } else {
        const cat = categories.find((c) => c.id === categoryId);
        if (cat) {
          if (subcategoryId) {
            const sub = cat.subcategorias.find((s) => s.id === subcategoryId);
            setCurrentSectionTitle(`${cat.nombre} > ${sub ? sub.nombre : ''}`);
          } else {
            setCurrentSectionTitle(cat.nombre);
          }
        }
      }
    },
    [categories]
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openProductModal = useCallback((product: Producto) => {
    setSelectedProductForModal(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProductForModal(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSearchQuery('');
    setSortOption('id,asc');
    setCurrentPage(0);
    setCurrentSectionTitle('Catálogo Completo');
  }, []);

  return (
    <CatalogContext.Provider
      value={{
        categories,
        selectedCategoryId,
        selectedSubcategoryId,
        currentSectionTitle,
        searchQuery,
        sortOption,
        currentPage,
        pageSize,
        pageData,
        isLoadingProducts,
        isLoadingCategories,
        isMenuOpen,
        isOfflineMode,
        selectedProductForModal,
        selectCategory,
        setSearchQuery,
        setSortOption,
        goToPage,
        toggleMenu,
        closeMenu,
        openProductModal,
        closeProductModal,
        resetFilters,
        refreshCatalog: loadProducts,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
