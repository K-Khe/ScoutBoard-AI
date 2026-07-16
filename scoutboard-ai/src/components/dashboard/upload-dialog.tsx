"use client";
import * as React from "react";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function UploadDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) setFileName(files[0].name);
  }

  function handleImport() {
    if (!fileName) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast.success("นำเข้าไฟล์สำเร็จ", { description: `${fileName} พร้อมใช้งานในเรดาร์แล้ว` });
      setFileName(null);
    }, 1400);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>นำเข้าไฟล์สินค้า</DialogTitle>
          <DialogDescription>
            อัปโหลดไฟล์ CSV ที่ส่งออกจากระบบร้านค้าของคุณ เพื่อให้เรดาร์เริ่มประมวลผลโอกาสสินค้า
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center transition-colors",
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
          {fileName ? (
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

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleImport} disabled={!fileName || loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "กำลังนำเข้า..." : "นำเข้าไฟล์"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
