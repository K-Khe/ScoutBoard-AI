import { Radar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ScanLoader({ label = "กำลังสแกนสัญญาณสินค้า", hint }: { label?: string; hint?: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Radar className="h-[18px] w-[18px] animate-radar-sweep" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-signal/10 to-transparent animate-scan-line" />
    </div>
  );
}
