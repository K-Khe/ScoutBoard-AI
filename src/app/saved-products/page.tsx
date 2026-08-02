"use client";
import * as React from "react";
import { Folder, Plus, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/dashboard/product-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { savedFolders } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/lib/use-product-store";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function SavedProductsPage() {
  const [active, setActive] = React.useState(savedFolders[0].id);
  const { products, isImported, toggleSaveProduct } = useProductStore();
  
  // Filter only saved products
  const savedProducts = React.useMemo(() => products.filter((p) => p.saved), [products]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">สินค้าที่บันทึกไว้</h1>
          <p className="mt-1 text-sm text-muted-foreground">จัดกลุ่มสินค้าที่น่าสนใจไว้ตามโฟลเดอร์เพื่อตัดสินใจภายหลัง</p>
        </div>
        <div className="flex items-center gap-2">
          {isImported ? (
            <Badge variant="success" className="gap-1.5 text-xs">
              <Database className="h-3 w-3" /> ข้อมูลของคุณ
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground">
              <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
            </Badge>
          )}
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" /> สร้างโฟลเดอร์ใหม่
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {savedFolders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              active === f.id
                ? "border-signal bg-signal/10 text-signal"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <Folder className="h-3.5 w-3.5" />
            {f.name}
            <span className="text-xs opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          กำลังแสดงสินค้าในโฟลเดอร์ &ldquo;{savedFolders.find((f) => f.id === active)?.name}&rdquo;
        </CardContent>
      </Card>

      <SectionHeader title={`รายการสินค้า (${savedProducts.length})`} />
      
      {savedProducts.length === 0 ? (
        <EmptyState 
          icon={Bookmark} 
          title="ยังไม่มีสินค้าที่บันทึกไว้" 
          description="ลองค้นหาสินค้าจากหน้า ค้นหาโอกาสสินค้า แล้วกดบันทึกเพื่อดูภายหลัง" 
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {savedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onToggleSave={toggleSaveProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
