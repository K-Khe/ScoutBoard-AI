"use client";
import * as React from "react";
import { toast } from "sonner";
import { Plus, Database } from "lucide-react";
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
import { offers as initialOffers } from "@/lib/mock-data";

export default function OffersPage() {
  const [offers, setOffers] = React.useState(initialOffers);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">สร้างข้อเสนอสินค้า</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">จัดการข้อเสนอส่วนลดและคอมมิชชั่นสำหรับสินค้าที่คัดเลือกไว้</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
              <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
            </Badge>
            <Button variant="secondary" size="sm" disabled className="opacity-50">
              อัปโหลดเงื่อนไขข้อเสนอ (เร็วๆ นี้)
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" /> สร้างข้อเสนอใหม่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>สร้างข้อเสนอใหม่</DialogTitle>
              <DialogDescription>ระบุชื่อสินค้าที่ต้องการทำข้อเสนอ ระบบจะสร้างฉบับร่างให้ทันที</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="offer-name">ชื่อสินค้า</Label>
              <Input id="offer-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น เซรั่มไนอาซินาไมด์" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                ยกเลิก
              </Button>
              <Button
                disabled={!name}
                onClick={() => {
                  setOffers((prev) => [
                    { id: `o${prev.length + 1}`, productName: name, discount: "ลด 10%", commission: "12%", validUntil: "-", status: "ฉบับร่าง" },
                    ...prev,
                  ]);
                  toast.success("สร้างข้อเสนอฉบับร่างแล้ว", { description: name });
                  setName("");
                  setOpen(false);
                }}
              >
                สร้างข้อเสนอ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SectionHeader title="ข้อเสนอทั้งหมด" subtitle={`${offers.length} รายการ`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {offers.map((o) => (
          <Card key={o.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{o.productName}</p>
                <Badge variant={o.status === "เผยแพร่แล้ว" ? "success" : "outline"}>{o.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>ส่วนลด: {o.discount}</span>
                <span>คอมมิชชั่น: {o.commission}</span>
                <span>ใช้ได้ถึง: {o.validUntil}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
