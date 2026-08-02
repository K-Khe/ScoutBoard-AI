"use client";
import * as React from "react";
import { UploadCloud, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { parseShopeeCSV, type ParseResult } from "@/lib/csv-schema";
import { useProductStore } from "@/lib/use-product-store";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PreviewTable({ result }: { result: ParseResult }) {
  const preview = result.products.slice(0, 3);
  if (preview.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-lg border text-xs">
      <table className="w-full min-w-[480px]">
        <thead className="border-b bg-muted/50">
          <tr>
            {["ชื่อสินค้า", "ราคา", "หมวดหมู่", "แหล่ง", "โอกาส"].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((p) => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="max-w-[180px] truncate px-3 py-2 font-medium">{p.name}</td>
              <td className="px-3 py-2">{p.price.toLocaleString("th-TH")} ฿</td>
              <td className="px-3 py-2 text-muted-foreground">{p.category}</td>
              <td className="px-3 py-2 text-muted-foreground">{p.source}</td>
              <td className="px-3 py-2">
                <Badge
                  variant={p.score === "สูง" ? "signal" : p.score === "ปานกลาง" ? "secondary" : "outline"}
                  className="text-[10px]"
                >
                  {p.score}
                </Badge>
              </td>
            </tr>
          ))}
          {result.products.length > 3 && (
            <tr>
              <td colSpan={5} className="px-3 py-2 text-center text-muted-foreground">
                และอีก {result.products.length - 3} รายการ...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ParseSummary({ result }: { result: ParseResult }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        นำเข้าได้ {result.products.length} รายการ
      </span>
      {result.skippedRows > 0 && (
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5" />
          ข้าม {result.skippedRows} แถวที่มีปัญหา
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dialog
// ---------------------------------------------------------------------------

export function UploadDialog({
  children,
  onImported,
}: {
  children: React.ReactNode;
  onImported?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [parsing, setParsing] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [parseResult, setParseResult] = React.useState<ParseResult | null>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { importProducts } = useProductStore();

  function reset() {
    setFileName(null);
    setParseResult(null);
    setParseError(null);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const file = files[0];
    setFileName(file.name);
    setParseResult(null);
    setParseError(null);
    setParsing(true);
    try {
      const result = await parseShopeeCSV(file);
      if (result.missingColumns.length > 0) {
        setParseError(
          `ไม่พบคอลัมน์ที่จำเป็น:\n• ${result.missingColumns.join("\n• ")}`
        );
        setParseResult(null);
      } else {
        setParseResult(result);
      }
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setParsing(false);
    }
  }

  async function handleImport() {
    if (!parseResult || parseResult.products.length === 0) return;
    setImporting(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay
    const warning = importProducts(parseResult.products, {
      fileName: fileName!,
      importedAt: new Date().toISOString(),
      rowCount: parseResult.products.length,
    });
    setImporting(false);
    setOpen(false);
    reset();

    if (warning) {
      toast.warning("นำเข้าสำเร็จ แต่มีคำเตือน", { description: warning });
    } else {
      toast.success(`นำเข้าสำเร็จ ${parseResult.products.length} รายการ`, {
        description:
          parseResult.skippedRows > 0
            ? `ข้าม ${parseResult.skippedRows} แถวที่มีปัญหา — ตรวจสอบข้อมูลในไฟล์ CSV`
            : `${fileName} พร้อมใช้งานใน Product Finder แล้ว`,
      });
    }
    onImported?.();
  }

  const canImport = !!parseResult && parseResult.products.length > 0 && !importing;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>นำเข้าไฟล์สินค้า</DialogTitle>
          <DialogDescription>
            อัปโหลดไฟล์ CSV จากระบบร้านค้าของคุณ — รองรับหัวคอลัมน์ภาษาไทยและอังกฤษ
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-8 text-center transition-colors",
            dragOver && "border-signal bg-signal/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {parsing ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">กำลังอ่านไฟล์...</p>
            </>
          ) : fileName ? (
            <>
              <FileSpreadsheet className="h-7 w-7 text-teal" />
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">คลิกเพื่อเลือกไฟล์อื่น</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-xs text-muted-foreground">รองรับไฟล์ .csv ขนาดไม่เกิน 20MB</p>
            </>
          )}
        </div>

        {/* Error */}
        {parseError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p className="whitespace-pre-line">{parseError}</p>
          </div>
        )}

        {/* Parse summary + preview */}
        {parseResult && !parseError && (
          <div className="flex flex-col gap-3">
            <ParseSummary result={parseResult} />
            <PreviewTable result={parseResult} />
            {parseResult.skippedRows > 0 && parseResult.skippedReasons.length > 0 && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">ดูรายละเอียดแถวที่ถูกข้าม</summary>
                <ul className="mt-1.5 space-y-0.5 pl-3">
                  {parseResult.skippedReasons.slice(0, 10).map((r, i) => (
                    <li key={i} className="list-disc">
                      {r}
                    </li>
                  ))}
                  {parseResult.skippedReasons.length > 10 && (
                    <li>และอีก {parseResult.skippedReasons.length - 10} รายการ...</li>
                  )}
                </ul>
              </details>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {parseResult && (
            <Button variant="ghost" size="sm" onClick={reset} className="mr-auto gap-1">
              <Trash2 className="h-3.5 w-3.5" />
              ล้าง
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleImport} disabled={!canImport}>
            {importing && <Loader2 className="h-4 w-4 animate-spin" />}
            {importing ? "กำลังนำเข้า..." : `นำเข้า ${parseResult?.products.length ?? 0} รายการ`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
