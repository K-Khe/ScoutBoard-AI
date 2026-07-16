"use client";
import { toast } from "sonner";
import { Download, FileText, FileDown, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { reports } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">รายงานและส่งออก</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">
              ตรวจสถานะไฟล์ที่สร้างจากข้อมูล local ก่อนส่งออกจริง ทั้ง PDF และ CSV พร้อมใช้ใน workflow วิเคราะห์สินค้า
            </p>
          </div>
          <Button variant="secondary" onClick={() => toast("รีเฟรชสถานะรายงานแล้ว")}>
            <RefreshCcw className="h-4 w-4" />
            รีเฟรชสถานะ
          </Button>
        </div>
      </div>

      <SectionHeader title="รายงานล่าสุด" subtitle={`${reports.length} ไฟล์`} />

      <div className="flex flex-col gap-3">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.range} · สร้างเมื่อ {r.createdAt} · {r.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.status === "พร้อมดาวน์โหลด" ? "success" : "secondary"}>{r.status}</Badge>
                <Badge variant="outline">{r.format}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("เริ่มดาวน์โหลดแล้ว", { description: r.name })}
                >
                  <Download className="h-3.5 w-3.5" /> ดาวน์โหลด
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast("สร้างสำเนาใหม่", { description: `${r.name} จะถูกสร้างเป็นรอบล่าสุด` })}
                >
                  <FileDown className="h-3.5 w-3.5" /> สร้างใหม่
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
