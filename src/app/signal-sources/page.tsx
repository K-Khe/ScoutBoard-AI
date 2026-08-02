"use client";
import * as React from "react";
import { Plus, Rss, Database } from "lucide-react";
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
import { useSignalStore } from "@/lib/use-signal-store";
import type { SignalSource } from "@/lib/mock-data";

export default function SignalSourcesPage() {
  const { sources, addSignal } = useSignalStore();

  const [open, setOpen] = React.useState(false);
  const [handle, setHandle] = React.useState("");
  const [platform, setPlatform] = React.useState<SignalSource["platform"]>("Facebook");

  function handleSubmit() {
    if (!handle.trim()) return;
    addSignal(handle.trim(), platform);
    toast.success("เพิ่มแหล่งสัญญาณแล้ว", {
      description: `${handle.trim().startsWith("@") ? handle.trim() : `@${handle.trim()}`} · ${platform}`,
    });
    setHandle("");
    setPlatform("Facebook");
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">แหล่งสัญญาณโซเชียล</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">บัญชี Facebook และ Instagram ที่ระบบติดตามความเคลื่อนไหวอยู่</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
              <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
            </Badge>
            <Button variant="secondary" size="sm" disabled className="opacity-50">
              เชื่อมต่อ API โซเชียล (เร็วๆ นี้)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> เพิ่มแหล่งสัญญาณ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มแหล่งสัญญาณใหม่</DialogTitle>
              <DialogDescription>ระบุชื่อบัญชีที่ต้องการให้ระบบเริ่มติดตามความเคลื่อนไหว</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="handle">ชื่อบัญชี</Label>
                <Input
                  id="handle"
                  placeholder="@ชื่อบัญชี"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">แพลตฟอร์ม</Label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as SignalSource["platform"])}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                ยกเลิก
              </Button>
              <Button disabled={!handle.trim()} onClick={handleSubmit}>
                เริ่มติดตาม
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SectionHeader title="รายการที่ติดตามอยู่" subtitle={`ทั้งหมด ${sources.length} บัญชี`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sources.map((s) => (
          <Card key={s.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Rss className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{s.handle}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.platform} · {s.followers > 0 ? `${formatNumber(s.followers)} ผู้ติดตาม` : "ยังไม่มีข้อมูล"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">โพสต์ที่ติดตามแล้ว {s.postsTracked} รายการ</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={s.status === "กำลังติดตาม" ? "success" : "outline"}>{s.status}</Badge>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.lastSignal}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
