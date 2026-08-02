"use client";

import * as React from "react";
import Papa from "papaparse";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Database, RefreshCcw, UploadCloud } from "lucide-react";
import { formatCurrencyTHB, formatNumber } from "@/lib/utils";
import { useMarketStore, parseMarketCSV } from "@/lib/use-market-store";
import { toast } from "sonner";
import type { ImportMeta } from "@/lib/create-local-store";

function densityTone(density: number) {
  if (density >= 70) return "destructive";
  if (density >= 45) return "secondary";
  return "success";
}

export default function MarketDensityPage() {
  const { rows, isImported, meta, importRows, clearRows } = useMarketStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [importing, setImporting] = React.useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const headers = results.meta.fields ?? [];
        const { rows: parsed, skipped, coercedTypes, missingCols } = parseMarketCSV(headers, results.data);

        if (parsed.length === 0) {
          toast.error("ไม่พบข้อมูลที่ใช้งานได้", {
            description: `คอลัมน์ที่หาไม่เจอ: ${missingCols.join(", ") || "ชื่อ (name)"}`,
          });
          setImporting(false);
          return;
        }

        const importMeta: ImportMeta = {
          fileName: file.name,
          importedAt: new Date().toISOString(),
          rowCount: parsed.length,
        };
        const warning = importRows(parsed, importMeta);

        if (warning) toast.warning(warning);
        if (coercedTypes.length > 0) toast.warning(
          `พบค่า "ประเภท" ที่ไม่รู้จัก ${coercedTypes.length} แถว`,
          { description: 'ค่าที่ถูกต้องคือ "ร้านค้า", "ครีเอเตอร์", หรือ "ตลาดย่อย" — แถวที่ผิดถูกกำหนดเป็น "ตลาดย่อย" แทน' }
        );
        if (skipped > 0) toast.info(`ข้ามแถวที่ไม่สมบูรณ์ ${skipped} แถว`);
        toast.success(`นำเข้าข้อมูล ${parsed.length} รายการเรียบร้อย`, { description: file.name });
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error() {
        toast.error("อ่านไฟล์ CSV ไม่ได้ กรุณาตรวจสอบรูปแบบไฟล์");
        setImporting(false);
      },
    });
  }

  const importedDate = meta?.importedAt
    ? new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(meta.importedAt))
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ความหนาแน่นตลาด</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">
              ดูระดับการแข่งขันของตลาดย่อย ร้านค้า และครีเอเตอร์ ก่อนตัดสินใจเข้าไปทำตลาด
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isImported ? (
              <>
                <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/80">
                  <Database className="h-3 w-3" /> ข้อมูลของคุณ · {meta?.rowCount} รายการ
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs text-white/60 hover:text-white"
                  onClick={() => clearRows()}
                >
                  <RefreshCcw className="h-3 w-3" /> กลับสู่ข้อมูลตัวอย่าง
                </Button>
              </>
            ) : (
              <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
                <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
              </Badge>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              {importing ? "กำลังนำเข้า..." : "นำเข้า CSV"}
            </Button>
          </div>
        </div>
        {isImported && importedDate && (
          <p className="mt-2 text-xs text-white/50">
            นำเข้าจาก <span className="font-medium text-white/80">{meta?.fileName}</span> เมื่อ {importedDate}
          </p>
        )}
      </div>

      <SectionHeader title="ภาพรวมความหนาแน่น" subtitle="ยิ่งเปอร์เซ็นต์สูง ยิ่งมีการแข่งขันมาก" />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>ความหนาแน่น</TableHead>
              <TableHead>คู่แข่ง</TableHead>
              <TableHead className="text-right">ราคาเฉลี่ย</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{row.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={densityTone(row.density) as any}>{row.density}%</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatNumber(row.competitors)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrencyTHB(row.avgPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
