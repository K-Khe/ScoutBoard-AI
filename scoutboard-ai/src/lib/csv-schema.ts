/**
 * csv-schema.ts
 * Parse a user-supplied CSV file into Product[] using flexible fuzzy column mapping.
 * Supports Thai and English column headers, trims whitespace, lowercases before matching.
 */

import Papa from "papaparse";
import type { Product, OpportunityScore } from "./mock-data";

// ---------------------------------------------------------------------------
// Column alias mapping (all lowercase, trimmed)
// Each entry: canonical field → list of accepted aliases
// ---------------------------------------------------------------------------
const COLUMN_ALIASES: Record<string, string[]> = {
  name: ["name", "ชื่อสินค้า", "product_name", "productname", "title", "ชื่อ", "สินค้า"],
  price: ["price", "ราคา", "ราคาขาย", "selling_price", "sellingprice", "จำนวนเงิน"],
  commission: ["commission", "คอมมิชชั่น", "commission_rate", "com", "ค่าคอม", "อัตราคอม", "commission%"],
  category: ["category", "หมวดหมู่", "หมวด", "cat", "product_category", "ประเภท"],
  source: ["source", "แหล่งที่มา", "platform", "แพลตฟอร์ม", "shop", "marketplace"],
  rating: ["rating", "คะแนน", "rate", "review_score", "star", "stars"],
  velocity: ["velocity", "orders_per_day", "ยอดขายต่อวัน", "daily_orders", "sold_per_day", "ordersperday"],
  score: ["score", "ระดับโอกาส", "opportunity", "opportunity_score", "tier"],
};

// ---------------------------------------------------------------------------
// Source normalizer
// ---------------------------------------------------------------------------
const SOURCE_MAP: Record<string, Product["source"]> = {
  shopee: "Shopee",
  "tiktok shop": "TikTok Shop",
  tiktok: "TikTok Shop",
  lazada: "Lazada",
};

function normalizeSource(raw: string): Product["source"] {
  return SOURCE_MAP[raw.toLowerCase().trim()] ?? "Shopee";
}

// ---------------------------------------------------------------------------
// Score deriver
// ---------------------------------------------------------------------------
function deriveScore(raw: string | undefined, velocity: number): OpportunityScore {
  if (raw) {
    const normalized = raw.trim();
    if (normalized === "สูง" || normalized.toLowerCase() === "high") return "สูง";
    if (normalized === "ต่ำ" || normalized.toLowerCase() === "low") return "ต่ำ";
    return "ปานกลาง";
  }
  if (velocity >= 200) return "สูง";
  if (velocity >= 80) return "ปานกลาง";
  return "ต่ำ";
}

// ---------------------------------------------------------------------------
// Find the actual column key in a row using alias lookup
// ---------------------------------------------------------------------------
function resolveColumn(headers: string[], field: string): string | undefined {
  const aliases = COLUMN_ALIASES[field] ?? [];
  return headers.find((h) => aliases.includes(h.toLowerCase().trim()));
}

// ---------------------------------------------------------------------------
// Parse result type
// ---------------------------------------------------------------------------
export interface ParseResult {
  products: Product[];
  skippedRows: number;
  skippedReasons: string[];
  missingColumns: string[];
}

// ---------------------------------------------------------------------------
// Main parse function
// ---------------------------------------------------------------------------
export function parseShopeeCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const headers: string[] = results.meta.fields ?? [];

        // Resolve required columns
        const nameCol = resolveColumn(headers, "name");
        const priceCol = resolveColumn(headers, "price");

        // Report missing required columns immediately
        const missingColumns: string[] = [];
        if (!nameCol) missingColumns.push("ชื่อสินค้า (name / ชื่อสินค้า / title)");
        if (!priceCol) missingColumns.push("ราคา (price / ราคา / selling_price)");

        if (missingColumns.length > 0) {
          resolve({ products: [], skippedRows: results.data.length, skippedReasons: [], missingColumns });
          return;
        }

        // Resolve optional columns
        const commissionCol = resolveColumn(headers, "commission");
        const categoryCol = resolveColumn(headers, "category");
        const sourceCol = resolveColumn(headers, "source");
        const ratingCol = resolveColumn(headers, "rating");
        const velocityCol = resolveColumn(headers, "velocity");
        const scoreCol = resolveColumn(headers, "score");

        const products: Product[] = [];
        let skippedRows = 0;
        const skippedReasons: string[] = [];

        results.data.forEach((row, idx) => {
          const rawName = nameCol ? row[nameCol]?.trim() : "";
          const rawPrice = priceCol ? row[priceCol]?.trim() : "";

          // Validate required fields
          if (!rawName) {
            skippedRows++;
            skippedReasons.push(`แถว ${idx + 2}: ไม่มีชื่อสินค้า`);
            return;
          }
          const price = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
          if (isNaN(price) || price <= 0) {
            skippedRows++;
            skippedReasons.push(`แถว ${idx + 2}: ราคา "${rawPrice}" ไม่ใช่ตัวเลขที่ถูกต้อง`);
            return;
          }

          // Parse optional fields with safe fallbacks
          const commission = commissionCol
            ? parseFloat(row[commissionCol]?.replace(/[^0-9.]/g, "") ?? "") || 10
            : 10;
          const velocity = velocityCol
            ? parseInt(row[velocityCol]?.replace(/[^0-9]/g, "") ?? "") || 0
            : 0;
          const rating = ratingCol
            ? parseFloat(row[ratingCol]?.replace(/[^0-9.]/g, "") ?? "") || undefined
            : undefined;

          const product: Product = {
            id: `import-${idx}-${Date.now()}`,
            name: rawName,
            price,
            commission,
            velocity,
            rating: rating && rating > 0 && rating <= 5 ? rating : undefined,
            category: categoryCol ? (row[categoryCol]?.trim() || "อื่นๆ") : "อื่นๆ",
            source: sourceCol ? normalizeSource(row[sourceCol] ?? "") : "Shopee",
            score: deriveScore(scoreCol ? row[scoreCol] : undefined, velocity),
            // Generate sparkline trend from velocity (mock-like but deterministic)
            trend: Array.from({ length: 7 }, (_, i) =>
              Math.max(1, Math.round(velocity * (0.5 + (i / 12)) * (0.9 + Math.random() * 0.2)))
            ),
          };
          products.push(product);
        });

        resolve({ products, skippedRows, skippedReasons, missingColumns: [] });
      },
      error(err) {
        reject(new Error(`ไม่สามารถอ่านไฟล์ได้: ${err.message}`));
      },
    });
  });
}
