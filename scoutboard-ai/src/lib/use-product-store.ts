/**
 * use-product-store.ts
 * SSR-safe React hook for reading/writing Product[] to localStorage.
 * - Versioned key: "scoutboard:products:v1"
 * - Uses generic createLocalStore factory
 */

"use client";

import type { Product } from "./mock-data";
import { products as mockProducts } from "./mock-data";
import { createLocalStore, ImportMeta } from "./create-local-store";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = "scoutboard:products:v1";
const META_KEY = "scoutboard:import_meta:v1";

const useBaseProductStore = createLocalStore<Product>(STORAGE_KEY, META_KEY, mockProducts);

export interface ProductStore {
  products: Product[];
  isImported: boolean;
  meta: ImportMeta | null;
  importProducts: (rows: Product[], meta: ImportMeta) => string | null;
  clearProducts: () => void;
  toggleSaveProduct: (id: string) => void;
}

export function useProductStore(): ProductStore {
  const { data, isImported, meta, importData, clearData, updateItem } = useBaseProductStore();

  function toggleSaveProduct(id: string) {
    const p = data.find((p) => p.id === id);
    if (p) {
      updateItem(id, { saved: !p.saved });
    }
  }

  return {
    products: data,
    isImported,
    meta,
    importProducts: importData,
    clearProducts: clearData,
    toggleSaveProduct,
  };
}
