"use client";
import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { products, type OpportunityScore } from "@/lib/mock-data";

const scores: OpportunityScore[] = ["สูง", "ปานกลาง", "ต่ำ"];

export default function ProductFinderPage() {
  const [query, setQuery] = React.useState("");
  const [activeScores, setActiveScores] = React.useState<OpportunityScore[]>(scores);

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) && activeScores.includes(p.score)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ค้นหาโอกาสสินค้า</h1>
        <p className="mt-1 text-sm text-muted-foreground">กรองสินค้าตามคำค้นหาและระดับโอกาสในการทำกำไร</p>
      </div>

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

      <SectionHeader title={`ผลการค้นหา (${filtered.length})`} subtitle="อัปเดตอัตโนมัติทุกครั้งที่มีการสแกนใหม่" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="ไม่พบสินค้าที่ตรงกับเงื่อนไข"
          description="ลองปรับคำค้นหาหรือเลือกระดับโอกาสเพิ่มเติม เพื่อดูรายการสินค้าที่กว้างขึ้น"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
