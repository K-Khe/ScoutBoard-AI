/**
 * create-local-store.ts
 * Generic factory for creating SSR-safe local-first data stores.
 * Maintains exact backward compatibility with use-product-store pattern:
 * - Data stored in dataKey as T[]
 * - Meta stored in metaKey as ImportMeta
 * - 4MB size limit warning
 */

import * as React from "react";

const SIZE_WARN_BYTES = 4 * 1024 * 1024; // 4 MB

export interface ImportMeta {
  fileName: string;
  importedAt: string; // ISO string
  rowCount: number;
}

export interface LocalStore<T> {
  data: T[];
  isImported: boolean;
  meta: ImportMeta | null;
  importData: (rows: T[], meta: ImportMeta) => string | null;
  clearData: () => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  addItem: (item: T) => void;
}

// ---------------------------------------------------------------------------
// Safe localStorage helpers
// ---------------------------------------------------------------------------
function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function estimateSizeBytes(value: unknown): number {
  return new Blob([JSON.stringify(value)]).size;
}

// ---------------------------------------------------------------------------
// Factory Function
// ---------------------------------------------------------------------------
export function createLocalStore<T extends { id: string }>(
  dataKey: string,
  metaKey: string,
  mockData: T[]
) {
  return function useStore(): LocalStore<T> {
    const [data, setData] = React.useState<T[]>(mockData);
    const [isImported, setIsImported] = React.useState(false);
    const [meta, setMeta] = React.useState<ImportMeta | null>(null);

    // Hydrate from localStorage on mount (client-only, SSR-safe)
    React.useEffect(() => {
      const stored = safeGet<T[]>(dataKey);
      const storedMeta = safeGet<ImportMeta>(metaKey);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        setData(stored);
        // isImported = true only when user actually imported a CSV file (meta exists).
        // Bookmarking mock data writes to localStorage but should NOT flip this flag.
        setIsImported(storedMeta !== null);
        setMeta(storedMeta);
      }
    }, []);

    function importData(rows: T[], importMeta: ImportMeta): string | null {
      // Size check before writing
      const sizeBytes = estimateSizeBytes(rows);
      let warning: string | null = null;
      if (sizeBytes > SIZE_WARN_BYTES) {
        warning = `ข้อมูลมีขนาด ${(sizeBytes / 1024 / 1024).toFixed(1)} MB ซึ่งใกล้ถึงขีดจำกัดของ localStorage (5 MB) บางข้อมูลอาจสูญหายหากนำเข้าข้อมูลเพิ่มเติม`;
      }

      const ok = safeSet(dataKey, rows);
      if (!ok) {
        return "ไม่สามารถบันทึกข้อมูลได้ เบราว์เซอร์อาจจำกัดการเขียน localStorage (เช่น โหมดส่วนตัว หรือพื้นที่เต็ม)";
      }
      safeSet(metaKey, importMeta);

      setData(rows);
      setIsImported(true);
      setMeta(importMeta);
      return warning;
    }

    function clearData() {
      safeRemove(dataKey);
      safeRemove(metaKey);
      setData(mockData);
      setIsImported(false);
      setMeta(null);
    }

    function updateItem(id: string, updates: Partial<T>) {
      setData((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
        // Always persist user actions (bookmark, etc.) regardless of whether
        // data came from CSV import or mock fallback. isImported only tracks
        // "did the user import a CSV file?" — it should not gate user edits.
        safeSet(dataKey, next);
        return next;
      });
    }

    function addItem(item: T) {
      setData((prev) => {
        // `prev` is the authoritative React state — append and persist `next`
        // in the same callback so UI state and localStorage are always in sync.
        const next = [...prev, item];
        safeSet(dataKey, next);
        return next;
      });
    }

    return { data, isImported, meta, importData, clearData, updateItem, addItem };
  };
}
