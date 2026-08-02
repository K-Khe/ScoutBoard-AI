"use client";
import * as React from "react";
import { Plus, Database, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SectionHeader } from "@/components/dashboard/section-header";
import { formatNumber } from "@/lib/utils";
import { useContentStore } from "@/lib/use-content-store";
import type { ContentItem } from "@/lib/mock-data";

const PLATFORM_OPTIONS: ContentItem["platform"][] = ["Facebook", "Instagram", "TikTok"];

export default function ContentTrackerPage() {
  const { items, addContent } = useContentStore();

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [platform, setPlatform] = React.useState<ContentItem["platform"]>("TikTok");
  const [engagement, setEngagement] = React.useState("");
  const [angle, setAngle] = React.useState("");

  const isValid = title.trim().length > 0;

  function handleSubmit() {
    if (!isValid) return;
    addContent(title, platform, Number(engagement) || 0, angle);
    toast.success("บันทึกคอนเทนต์แล้ว", { description: title.trim() });
    setTitle("");
    setPlatform("TikTok");
    setEngagement("");
    setAngle("");
    setOpen(false);
  }

  // Sort by engagement descending so highest always appears first
  const sorted = [...items].sort((a, b) => b.engagement - a.engagement);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ติดตามคอนเทนต์ขายดี</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">คอนเทนต์ที่เกี่ยวข้องกับสินค้าในเรดาร์ พร้อมมุมนำเสนอที่ใช้</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
              <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
            </Badge>
            <Button variant="secondary" size="sm" disabled className="opacity-50">
              นำเข้า URL คอนเทนต์ (เร็วๆ นี้)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> บันทึกคอนเทนต์
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>บันทึกคอนเทนต์ใหม่</DialogTitle>
              <DialogDescription>กรอกข้อมูลคอนเทนต์ที่ต้องการติดตามเอนเกจเมนต์</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ct-title">ชื่อ / หัวข้อคอนเทนต์</Label>
                <Input
                  id="ct-title"
                  placeholder="เช่น รีวิวเซรั่มไนอาซินาไมด์ 7 วันเห็นผล"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ct-platform">แพลตฟอร์ม</Label>
                <select
                  id="ct-platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as ContentItem["platform"])}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ct-engagement">เอนเกจเมนต์ (ตัวเลข)</Label>
                <Input
                  id="ct-engagement"
                  type="number"
                  min={0}
                  placeholder="เช่น 18400"
                  value={engagement}
                  onChange={(e) => setEngagement(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ct-angle">มุมคอนเทนต์</Label>
                <Input
                  id="ct-angle"
                  placeholder="เช่น ก่อน-หลังใช้งาน"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button disabled={!isValid} onClick={handleSubmit}>บันทึก</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SectionHeader
        title="คอนเทนต์ที่มีเอนเกจเมนต์สูง"
        subtitle={`ทั้งหมด ${items.length} รายการ · เรียงตามเอนเกจเมนต์`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <Card key={c.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">{c.platform}</Badge>
                <span className="text-xs text-muted-foreground">{c.postedAt}</span>
              </div>
              <p className="font-display text-sm font-semibold leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">มุมคอนเทนต์: {c.angle || "—"}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <p className="text-sm font-medium text-teal-700 dark:text-teal-400">
                  {formatNumber(c.engagement)} เอนเกจเมนต์
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
