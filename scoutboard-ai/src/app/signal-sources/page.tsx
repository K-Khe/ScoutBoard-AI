"use client";
import * as React from "react";
import { Plus, Rss } from "lucide-react";
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
import { signalSources } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function SignalSourcesPage() {
  const [open, setOpen] = React.useState(false);
  const [handle, setHandle] = React.useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">แหล่งสัญญาณโซเชียล</h1>
          <p className="mt-1 text-sm text-muted-foreground">บัญชี Facebook และ Instagram ที่ระบบติดตามความเคลื่อนไหวอยู่</p>
        </div>
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
            <div className="space-y-2">
              <Label htmlFor="handle">ชื่อบัญชี</Label>
              <Input id="handle" placeholder="@ชื่อบัญชี" value={handle} onChange={(e) => setHandle(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                ยกเลิก
              </Button>
              <Button
                disabled={!handle}
                onClick={() => {
                  toast.success("เพิ่มแหล่งสัญญาณแล้ว", { description: handle });
                  setHandle("");
                  setOpen(false);
                }}
              >
                เริ่มติดตาม
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SectionHeader title="รายการที่ติดตามอยู่" subtitle={`ทั้งหมด ${signalSources.length} บัญชี`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {signalSources.map((s) => (
          <Card key={s.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Rss className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{s.handle}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.platform} · {formatNumber(s.followers)} ผู้ติดตาม
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
