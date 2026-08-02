/**
 * use-market-store.ts
 * Local-first store for Market Density data.
 * Uses createLocalStore factory — same pattern as use-product-store.ts.
 * - Storage key: "scoutboard:market:v1"
 * - Falls back to mock marketRows when empty
 */

"use client";

import type { MarketRow } from "./mock-data";
import { marketRows as mockMarketRows } from "./mock-data";
import { createLocalStore } from "./create-local-store";
import type { ImportMeta } from "./create-local-store";

const STORAGE_KEY = "scoutboard:market:v1";
const META_KEY = "scoutboard:market_meta:v1";

const useBaseMarketStore = createLocalStore<MarketRow>(STORAGE_KEY, META_KEY, mockMarketRows);

export interface MarketStore {
  rows: MarketRow[];
  isImported: boolean;
  meta: ImportMeta | null;
  importRows: (rows: MarketRow[], meta: ImportMeta) => string | null;
  clearRows: () => void;
}

export function useMarketStore(): MarketStore {
  const { data, isImported, meta, importData, clearData } = useBaseMarketStore();
  return {
    rows: data,
    isImported,
    meta,
    importRows: importData,
    clearRows: clearData,
  };
}

// ---------------------------------------------------------------------------
// CSV column fuzzy-mapping (same approach as upload-dialog.tsx)
// ---------------------------------------------------------------------------
const MARKET_COLUMN_MAP: Record<keyof Omit<MarketRow, "id">, string[]> = {
  name:        ["name", "ชื่อ", "ตลาด", "market", "title"],
  type:        ["type", "ประเภท", "category"],
  density:     ["density", "ความหนาแน่น", "competition"],
  competitors: ["competitors", "คู่แข่ง", "rival"],
  avgPrice:    ["avgprice", "avgprice", "ราคาเฉลี่ย", "price", "avg_price"],
};

function fuzzyFind(headers: string[], candidates: string[]): string | undefined {
  return headers.find((h) =>
    candidates.some((c) => h.toLowerCase().replace(/\s/g, "").includes(c.toLowerCase()))
  );
}

export interface CoercedTypeInfo {
  rowIndex: number;
  rawValue: string;
  correctedValue: MarketRow["type"];
}

export interface MarketCSVResult {
  rows: MarketRow[];
  skipped: number;
  coercedTypes: CoercedTypeInfo[];   // details of rows where type was invalid → defaulted to "ตลาดย่อย"
  missingCols: string[];
}

export function parseMarketCSV(rawHeaders: string[], records: Record<string, string>[]): MarketCSVResult {
  const mapped: Partial<Record<keyof Omit<MarketRow, "id">, string>> = {};
  const missingCols: string[] = [];

  for (const [field, candidates] of Object.entries(MARKET_COLUMN_MAP)) {
    const found = fuzzyFind(rawHeaders, candidates);
    if (found) {
      mapped[field as keyof typeof mapped] = found;
    } else {
      missingCols.push(field);
    }
  }

  const rows: MarketRow[] = [];
  let skipped = 0;
  const coercedTypes: CoercedTypeInfo[] = [];

  records.forEach((rec, idx) => {
    const name = mapped.name ? rec[mapped.name]?.trim() : "";
    if (!name) { skipped++; return; }

    const rawType = (mapped.type ? rec[mapped.type]?.trim() : "") as MarketRow["type"];
    const validTypes: MarketRow["type"][] = ["ร้านค้า", "ครีเอเตอร์", "ตลาดย่อย"];
    const isValidType = validTypes.includes(rawType);
    if (!isValidType) {
      coercedTypes.push({
        rowIndex: idx,
        rawValue: rawType,
        correctedValue: "ตลาดย่อย",
      });
    }

    rows.push({
      id: `m-csv-${idx}`,
      name,
      type: isValidType ? rawType : "ตลาดย่อย",
      density: mapped.density ? Math.min(100, Math.max(0, Number(rec[mapped.density]) || 0)) : 0,
      competitors: mapped.competitors ? (Number(rec[mapped.competitors]) || 0) : 0,
      avgPrice: mapped.avgPrice ? (Number(rec[mapped.avgPrice]) || 0) : 0,
    });
  });

  return { rows, skipped, coercedTypes, missingCols };
}
