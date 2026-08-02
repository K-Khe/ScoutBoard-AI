"use client";
import * as React from "react";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScanLoader } from "@/components/dashboard/scan-loader";
import { useProductStore } from "@/lib/use-product-store";
import { Database } from "lucide-react";

const insightActions = [
  "ปรับราคาให้ต่ำกว่าคู่แข่งหลัก 5-8% ในช่วง 3 วันแรก เพื่อดันยอดขายเริ่มต้น",
  "เน้นคอนเทนต์แบบ ก่อน-หลังใช้งาน เนื่องจากกลุ่มเป้าหมายตอบรับมุมนี้ดีที่สุด",
  "ทำข้อเสนอคอมมิชชั่นพิเศษให้ครีเอเตอร์ 5 อันดับแรกที่เกี่ยวข้องกับหมวดนี้",
];

export default function ProductInsightPage() {
  const { products, isImported, meta } = useProductStore();
  
  // Default to the first product if available
  const initialProduct = products.length > 0 ? products[0] : null;
  const [selected, setSelected] = React.useState(initialProduct);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string[] | null>(null);

  // Sync selected if products change (e.g. after import)
  React.useEffect(() => {
    if (products.length > 0 && (!selected || !products.find((p) => p.id === selected.id))) {
      setSelected(products[0]);
    }
  }, [products, selected]);

  function generate() {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(insightActions);
    }, 1600);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">อินไซต์สินค้าอัตโนมัติ</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">ให้ระบบวิเคราะห์สินค้าและแนะนำแนวทางดำเนินการต่อ</p>
          </div>
          {isImported ? (
            <Badge variant="success" className="gap-1.5 text-xs">
              <Database className="h-3 w-3" />
              ข้อมูลของคุณ · {meta?.rowCount ?? products.length} รายการ
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
              <Database className="h-3 w-3" />
              ข้อมูลตัวอย่าง · {products.length} รายการ
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2" disabled={!selected}>
              {selected ? (selected.name.length > 28 ? selected.name.slice(0, 28) + "…" : selected.name) : "เลือกสินค้า"}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-y-auto">
            {products.map((p) => (
              <DropdownMenuItem key={p.id} onClick={() => setSelected(p)}>
                {p.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={generate} disabled={loading || !selected}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "กำลังวิเคราะห์..." : "สร้างอินไซต์"}
        </Button>
      </div>

      {loading && selected && <ScanLoader label="กำลังวิเคราะห์สินค้าที่เลือก" hint={selected.name} />}

      {!loading && result && selected && (
        <Card className="border-signal/30">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="signal" className="gap-1">
                <Sparkles className="h-3 w-3" /> อินไซต์
              </Badge>
              <span className="text-sm font-medium">{selected.name}</span>
            </div>
            <ul className="space-y-2.5">
              {result.map((r, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15 text-xs font-semibold text-signal">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!loading && !result && (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            เลือกสินค้าและกด &ldquo;สร้างอินไซต์&rdquo; เพื่อดูคำแนะนำการดำเนินการ
          </CardContent>
        </Card>
      )}
    </div>
  );
}
