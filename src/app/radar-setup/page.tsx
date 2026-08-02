"use client";
import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function RadarSetupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ตั้งค่าเรดาร์</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">กำหนดเงื่อนไขที่เรดาร์ใช้ในการค้นหาสินค้าที่มีแนวโน้มดี</p>
          </div>
          <Badge variant="success" className="gap-1.5 text-xs">
            <Database className="h-3 w-3" /> ตั้งค่าถูกบันทึกในเบราว์เซอร์
          </Badge>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>เงื่อนไขการสแกน</CardTitle>
          <CardDescription>สินค้าที่ไม่ตรงเงื่อนไขจะถูกซ่อนจากรายการโอกาสสินค้า</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>ราคาขั้นต่ำ (บาท)</Label>
              <Input type="number" defaultValue={50} />
            </div>
            <div className="space-y-2">
              <Label>ราคาสูงสุด (บาท)</Label>
              <Input type="number" defaultValue={1500} />
            </div>
            <div className="space-y-2">
              <Label>คอมมิชชั่นขั้นต่ำ (%)</Label>
              <Input type="number" defaultValue={10} />
            </div>
            <div className="space-y-2">
              <Label>ออเดอร์ต่อวันขั้นต่ำ</Label>
              <Input type="number" defaultValue={50} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {[
              { label: "แจ้งเตือนเมื่อพบโอกาสสูง", desc: "รับการแจ้งเตือนทันทีเมื่อพบสินค้าคะแนนโอกาสสูง" },
              { label: "สแกนอัตโนมัติทุก 6 ชั่วโมง", desc: "ให้ระบบสแกน Shopee Feed โดยอัตโนมัติ" },
              { label: "ซ่อนสินค้าที่บันทึกไว้แล้ว", desc: "ไม่แสดงสินค้าที่ถูกบันทึกไว้ในรายการค้นหาซ้ำ" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => toast.success("บันทึกการตั้งค่าเรดาร์แล้ว")}>บันทึกการตั้งค่า</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
