/**
 * export-utils.ts
 * Export Product[] to CSV or PDF with real Thai text support.
 *
 * PDF: Uses jsPDF + jsPDF-AutoTable with Sarabun font (lazy-loaded, cached in memory).
 * CSV: Uses papaparse unparse (no font needed).
 *
 * Both functions trigger a browser download via a temporary <a> element.
 */

"use client";

import Papa from "papaparse";
import type { Product } from "./mock-data";

// ---------------------------------------------------------------------------
// Shared download helper
// ---------------------------------------------------------------------------
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Date helper
// ---------------------------------------------------------------------------
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------
export function exportProductsCSV(products: Product[], filename?: string): void {
  const rows = products.map((p) => ({
    ชื่อสินค้า: p.name,
    "ราคา (บาท)": p.price,
    "คอมมิชชั่น (%)": p.commission,
    หมวดหมู่: p.category,
    แหล่งที่มา: p.source,
    "คะแนน (1-5)": p.rating ?? "",
    ระดับโอกาส: p.score,
    "ยอดขาย/วัน (จำลอง)": p.velocity,
  }));

  const csv = Papa.unparse(rows, { quotes: true });
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  // \uFEFF = BOM ช่วยให้ Excel เปิดไฟล์ภาษาไทยได้ถูกต้อง
  triggerDownload(blob, filename ?? `scoutboard-products-${todayISO()}.csv`);
}

// ---------------------------------------------------------------------------
// PDF Export — lazy-load Sarabun font (cached per session)
// ---------------------------------------------------------------------------

// Module-level cache: font loaded once per browser session
let _fontCache: string | null = null;

async function loadSarabunFont(): Promise<string> {
  if (_fontCache) return _fontCache;
  // Dynamic import — this chunk is separate from main bundle
  const { sarabunBase64 } = await import("./fonts/sarabun-b64");
  _fontCache = sarabunBase64;
  return _fontCache;
}

export async function exportProductsPDF(
  products: Product[],
  title: string = "รายงานโอกาสสินค้า",
  filename?: string
): Promise<void> {
  // Dynamic import jspdf + autotable (also lazy — not in main bundle)
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const fontBase64 = await loadSarabunFont();

  // Create PDF in landscape A4
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Register Thai font as BOTH normal and bold (same file)
  // This prevents jsPDF from falling back to Helvetica (non-Thai) when bold is requested
  doc.addFileToVFS("Sarabun-Regular.ttf", fontBase64);
  doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
  doc.addFont("Sarabun-Regular.ttf", "Sarabun", "bold"); // alias → same Regular file
  doc.setFont("Sarabun", "normal");

  // ----- Header -----
  const dateStr = new Intl.DateTimeFormat("th-TH", {
    dateStyle: "full",
  }).format(new Date());

  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("ScoutBoard AI — " + title, 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`สร้างเมื่อ: ${dateStr}  |  จำนวน: ${products.length} รายการ`, 14, 25);

  // ----- Table -----
  const headers = [
    "ชื่อสินค้า",
    "ราคา (฿)",
    "คอม (%)",
    "หมวดหมู่",
    "แหล่งที่มา",
    "คะแนน",
    "ระดับโอกาส",
    "ยอดขาย/วัน",
  ];

  const rows = products.map((p) => [
    p.name,
    p.price.toLocaleString("th-TH"),
    `${p.commission}%`,
    p.category,
    p.source,
    p.rating ? p.rating.toFixed(1) : "-",
    p.score,
    p.velocity > 0 ? p.velocity.toString() : "-",
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 30,
    styles: {
      font: "Sarabun",
      fontSize: 9,
      cellPadding: 2.5,
    },
    headStyles: {
      font: "Sarabun",
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: "normal",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 70 }, // ชื่อสินค้า (wide)
      1: { halign: "right" },
      2: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "center" },
      7: { halign: "right" },
    },
    // Footer on every page
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("Sarabun");
      doc.text(
        `หน้า ${data.pageNumber} / ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 6,
        { align: "right" }
      );
    },
  });

  doc.save(filename ?? `scoutboard-report-${todayISO()}.pdf`);
}
