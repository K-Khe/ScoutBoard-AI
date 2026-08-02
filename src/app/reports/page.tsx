"use client";
import * as React from "react";
import { toast } from "sonner";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
  Loader2,
  Database,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { UploadDialog } from "@/components/dashboard/upload-dialog";
import { useProductStore } from "@/lib/use-product-store";
import { reports } from "@/lib/mock-data";

export default function ReportsPage() {
  const { products, isImported, meta } = useProductStore();
  const [exportingCSV, setExportingCSV] = React.useState(false);
  const [exportingPDF, setExportingPDF] = React.useState(false);

  async function handleExportCSV() {
    setExportingCSV(true);
    try {
      const { exportProductsCSV } = await import("@/lib/export-utils");
      exportProductsCSV(products);
      toast.success("ส่งออก CSV สำเร็จ", {
        description: `${products.length} รายการ — ตรวจสอบในโฟลเดอร์ดาวน์โหลดของคุณ`,
      });
    } catch {
      toast.error("ส่งออกไม่สำเร็จ", { description: "กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setExportingCSV(false);
    }
  }

  async function handleExportPDF() {
    setExportingPDF(true);
    try {
      const { exportProductsPDF } = await import("@/lib/export-utils");
      await exportProductsPDF(products, "รายงานโอกาสสินค้า");
      toast.success("สร้าง PDF สำเร็จ", {
        description: `${products.length} รายการ — ตรวจสอบในโฟลเดอร์ดาวน์โหลดของคุณ`,
      });
    } catch {
      toast.error("สร้าง PDF ไม่สำเร็จ", { description: "กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setExportingPDF(false);
    }
  }

  const importedDate = meta?.importedAt
    ? new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(meta.importedAt)
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              รายงานและส่งออก
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">
              ส่งออกข้อมูลสินค้าเป็นไฟล์ CSV หรือ PDF พร้อมรองรับภาษาไทยเต็มรูปแบบ
            </p>
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

      {/* Export actions */}
      <SectionHeader
        title="สร้างรายงานใหม่"
        subtitle={
          isImported
            ? `จากข้อมูลที่นำเข้า${importedDate ? ` เมื่อ ${importedDate}` : ""}`
            : "ใช้ข้อมูลตัวอย่าง — นำเข้า CSV เพื่อ export ข้อมูลของคุณเอง"
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CSV Export Card */}
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">ส่งออกเป็น CSV</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  เปิดได้ใน Excel, Google Sheets — รองรับภาษาไทย (UTF-8 BOM)
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  คอลัมน์: ชื่อ, ราคา, คอมมิชชั่น, หมวดหมู่, แหล่งที่มา, คะแนน, ระดับโอกาส
                </p>
              </div>
            </div>
            <Button
              className="mt-4 w-full gap-2"
              variant="outline"
              onClick={handleExportCSV}
              disabled={exportingCSV}
            >
              {exportingCSV ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exportingCSV
                ? "กำลังสร้างไฟล์..."
                : `ดาวน์โหลด CSV (${products.length} รายการ)`}
            </Button>
          </CardContent>
        </Card>

        {/* PDF Export Card */}
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">สร้าง PDF รายงาน</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  หน้ากว้าง A4 landscape — ฟอนต์ Sarabun รองรับภาษาไทยเต็มรูปแบบ
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  โหลดฟอนต์ครั้งแรกอาจใช้เวลา 1-2 วินาที (cache หลังจากนั้น)
                </p>
              </div>
            </div>
            <Button
              className="mt-4 w-full gap-2"
              onClick={handleExportPDF}
              disabled={exportingPDF}
            >
              {exportingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exportingPDF
                ? "กำลังสร้าง PDF..."
                : `สร้าง PDF (${products.length} รายการ)`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import prompt if using mock data */}
      {!isImported && (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-medium">ต้องการ export ข้อมูลของคุณเอง?</p>
              <p className="text-xs text-muted-foreground">
                นำเข้าไฟล์ CSV ก่อน แล้วจึงกด export เพื่อดาวน์โหลดข้อมูลจริง
              </p>
            </div>
            <UploadDialog>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                <Database className="h-3.5 w-3.5" />
                นำเข้า CSV
              </Button>
            </UploadDialog>
          </CardContent>
        </Card>
      )}

      {/* Historical mock reports */}
      <SectionHeader
        title="ประวัติรายงาน"
        subtitle={`${reports.length} ไฟล์ (ตัวอย่าง)`}
      />

      <div className="flex flex-col gap-3">
        {reports.map((r) => (
          <Card key={r.id} className="opacity-70">
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
                <Badge variant={r.status === "พร้อมดาวน์โหลด" ? "success" : "secondary"}>
                  {r.status}
                </Badge>
                <Badge variant="outline">{r.format}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast("ไฟล์ประวัตินี้เป็นตัวอย่าง", {
                      description: "ใช้ปุ่ม Export ด้านบนเพื่อดาวน์โหลดข้อมูลจริง",
                    })
                  }
                >
                  <FileDown className="h-3.5 w-3.5" /> ดาวน์โหลด
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
