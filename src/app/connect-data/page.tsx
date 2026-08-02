"use client";
import * as React from "react";
import { toast } from "sonner";
import { Chrome, FileSpreadsheet, ShoppingBag, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";

const integrations = [
  { id: "csv", name: "Shopee CSV/Datafeed", desc: "นำเข้าข้อมูลสินค้าหรือ feed ที่ export มาแล้ว", icon: FileSpreadsheet, connected: true },
  { id: "connector", name: "TrendRadar Connector", desc: "โหลด Chrome extension แบบ unpacked เพื่อดึงจาก Shopee Affiliate", icon: Chrome, connected: false },
  { id: "local", name: "คลังข้อมูล local", desc: "จัดเก็บรายการสินค้าที่นำเข้าเพื่อค้นหาและวางแผนต่อ", icon: ShoppingBag, connected: true },
];

const steps = [
  "ติดตั้ง Chrome Connector แบบ unpacked",
  "ล็อกอิน Shopee Affiliate ด้วยบัญชีของคุณเอง",
  "อัปโหลด CSV/Datafeed หรือดึงจากหน้า Affiliate",
];

export default function ConnectDataPage() {
  const [state, setState] = React.useState(integrations);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">เชื่อมต่อข้อมูล</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">
              หน้าเริ่มต้นสำหรับ workflow local-first: นำเข้าจาก CSV/Datafeed, ใช้ Connector ดึงจาก Shopee Affiliate,
              แล้วเก็บลงคลังข้อมูล local เพื่อส่งต่อไป Product Finder และรายงาน
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => toast("เปิดคู่มือ Connector", { description: "ไปที่ chrome://extensions แล้วเลือก Load unpacked" })}
          >
            <Chrome className="h-4 w-4" />
            คู่มือ Connector
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Step {index + 1}</p>
              <p className="mt-2 text-sm font-medium text-white">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader title="แหล่งข้อมูลทั้งหมด" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {state.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-display text-sm font-semibold">
                    {item.name}
                    {item.connected && <CheckCircle2 className="h-3.5 w-3.5 text-teal" />}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {item.id === "connector"
                      ? "ใช้ Chrome แบบ unpacked และให้ผู้ใช้ล็อกอินบัญชีของตัวเองเท่านั้น"
                      : item.id === "csv"
                        ? "เหมาะกับไฟล์ CSV/Datafeed ที่ลูกค้าเตรียมมา"
                        : "ข้อมูลจะถูกเก็บในเครื่องเพื่อใช้กับ workflow วิเคราะห์สินค้า"}
                  </p>
                </div>
              </div>
              <Button
                variant={item.connected ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  setState((prev) => prev.map((p) => (p.id === item.id ? { ...p, connected: !p.connected } : p)));
                  toast(item.connected ? `ปิด ${item.name} แล้ว` : `เปิด ${item.name} แล้ว`);
                }}
              >
                {item.connected ? "ใช้งานอยู่" : "เชื่อมต่อ"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">ก่อนทดสอบ workflow จริง</p>
              <p className="text-xs text-muted-foreground">
                เตรียม Chrome, บัญชี Shopee Affiliate หรือไฟล์ CSV/Datafeed และใส่ AI key เฉพาะตอนจะใช้ฟีเจอร์ AI หนัก
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast("ส่งคำขอเรียบร้อย", { description: "ทีมงานจะติดต่อกลับภายใน 2 วันทำการ" })}>
            ขอแพลตฟอร์มเพิ่ม
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
