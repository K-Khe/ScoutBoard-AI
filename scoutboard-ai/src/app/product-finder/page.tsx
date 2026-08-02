"use client";
import * as React from "react";
import { Search, SlidersHorizontal, Database, RefreshCcw, UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/dashboard/product-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { UploadDialog } from "@/components/dashboard/upload-dialog";
import { useProductStore } from "@/lib/use-product-store";
import type { OpportunityScore } from "@/lib/mock-data";

const scores: OpportunityScore[] = ["สูง", "ปานกลาง", "ต่ำ"];

export default function ProductFinderPage() {
  const { products, isImported, meta, clearProducts, toggleSaveProduct } = useProductStore();
  const [query, setQuery] = React.useState("");
  const [activeScores, setActiveScores] = React.useState<OpportunityScore[]>(scores);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) && activeScores.includes(p.score)
  );

  // Format import date nicely
  const importedDate = meta?.importedAt
    ? new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(meta.importedAt)
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ค้นหาโอกาสสินค้า</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            กรองสินค้าตามคำค้นหาและระดับโอกาสในการทำกำไร
          </p>
        </div>

        {/* Data source badge + actions */}
        <div className="flex flex-wrap items-center gap-2">
          {isImported ? (
            <>
              <Badge variant="success" className="gap-1.5 text-xs">
                <Database className="h-3 w-3" />
                ข้อมูลของคุณ · {meta?.rowCount ?? products.length} รายการ
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-muted-foreground"
                onClick={() => clearProducts()}
              >
                <RefreshCcw className="h-3 w-3" />
                กลับสู่ข้อมูลตัวอย่าง
              </Button>
            </>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground">
              <Database className="h-3 w-3" />
              ข้อมูลตัวอย่าง
            </Badge>
          )}
          <UploadDialog>
            <Button variant="outline" size="sm" className="gap-1.5">
              <UploadCloud className="h-3.5 w-3.5" />
              นำเข้า CSV
            </Button>
          </UploadDialog>
        </div>
      </div>

      {/* Import meta info bar */}
      {isImported && importedDate && (
        <p className="text-xs text-muted-foreground">
          นำเข้าจาก <span className="font-medium text-foreground">{meta?.fileName}</span>{" "}
          เมื่อ {importedDate}
        </p>
      )}

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า เช่น เซรั่ม, หูฟัง, ขวดน้ำ..."
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              ระดับโอกาส
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>แสดงเฉพาะ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {scores.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={activeScores.includes(s)}
                onCheckedChange={(checked) =>
                  setActiveScores((prev) => (checked ? [...prev, s] : prev.filter((x) => x !== s)))
                }
              >
                โอกาส{s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SectionHeader
        title={`ผลการค้นหา (${filtered.length})`}
        subtitle={
          isImported
            ? "แสดงจากข้อมูลที่คุณนำเข้า"
            : "อัปเดตอัตโนมัติทุกครั้งที่มีการสแกนใหม่"
        }
      />

      {filtered.length === 0 ? (
        isImported ? (
          <EmptyState
            icon={Search}
            title="ไม่พบสินค้าที่ตรงกับเงื่อนไข"
            description="ลองปรับคำค้นหาหรือเลือกระดับโอกาสเพิ่มเติม"
          />
        ) : (
          <EmptyState
            icon={UploadCloud}
            title="ยังไม่มีข้อมูลสินค้า"
            description="นำเข้าไฟล์ CSV เพื่อเริ่มวิเคราะห์สินค้าของคุณ"
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onToggleSave={toggleSaveProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
