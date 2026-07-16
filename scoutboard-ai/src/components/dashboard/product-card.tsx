"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Bookmark, Eye, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatCurrencyTHB } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("h-10 w-full", className)}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const scoreVariant: Record<Product["score"], "signal" | "secondary" | "outline"> = {
  สูง: "signal",
  ปานกลาง: "secondary",
  ต่ำ: "outline",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [saved, setSaved] = React.useState(!!product.saved);
  const rating = product.rating ?? 4.6;
  const trendLatest = product.trend[product.trend.length - 1] ?? product.velocity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.05 }}
    >
      <Card className="group h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <CardContent className="flex h-full flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm",
                  index % 4 === 0 && "bg-gradient-to-br from-cyan-500 to-sky-700",
                  index % 4 === 1 && "bg-gradient-to-br from-amber-500 to-orange-700",
                  index % 4 === 2 && "bg-gradient-to-br from-emerald-500 to-teal-700",
                  index % 4 === 3 && "bg-gradient-to-br from-slate-600 to-slate-900"
                )}
              >
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 font-display text-sm font-semibold leading-snug">{product.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.category} · {product.source}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 font-medium text-foreground/80">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1 font-medium text-foreground/80">
                    {product.velocity} ออเดอร์/วัน
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                setSaved((s) => !s);
                toast(saved ? "นำออกจากรายการบันทึกแล้ว" : "บันทึกสินค้าแล้ว", {
                  description: product.name,
                });
              }}
              aria-label="บันทึกสินค้า"
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-signal text-signal")} />
            </Button>
          </div>

          <div className="text-teal">
            <Sparkline data={product.trend} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-display font-semibold">{formatCurrencyTHB(product.price)}</span>
            <span className="text-xs text-muted-foreground">คอมมิชชั่น {product.commission}%</span>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={scoreVariant[product.score]}>โอกาส{product.score}</Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  ดูรายละเอียด
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>
                    สรุปข้อมูลสำหรับ workflow local-first จากชุดข้อมูลที่นำเข้าแล้ว
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">ราคา</p>
                    <p className="mt-1 font-semibold">{formatCurrencyTHB(product.price)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">ยอดขายเฉลี่ย</p>
                    <p className="mt-1 font-semibold">{product.velocity} ออเดอร์/วัน</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="mt-1 font-semibold">{rating.toFixed(1)} / 5</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">คอมมิชชั่น</p>
                    <p className="mt-1 font-semibold">{product.commission}%</p>
                  </div>
                </div>
                <div className="rounded-xl border p-3 text-sm text-muted-foreground">
                  แนวโน้มล่าสุดอยู่ที่ {trendLatest} จุดจากกราฟสัปดาห์นี้
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
