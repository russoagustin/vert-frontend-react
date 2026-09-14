import { useContext } from 'react';
import { CatalogContext, type CatalogContextType } from '../context/CatalogContextInstance';

export function useCatalog(): CatalogContextType {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog debe ser utilizado dentro de un CatalogProvider');
  }
  return context;
}
