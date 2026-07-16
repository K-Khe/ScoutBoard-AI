"use client";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { overviewStats } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function CreditMeter() {
  const pct = Math.round((overviewStats.creditsUsed / overviewStats.creditsTotal) * 100);

  return (
    <div className="rounded-lg border border-sidebar-border bg-accent/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Zap className="h-3.5 w-3.5 text-signal" />
          แพ็กเกจ {overviewStats.planName}
        </span>
        <span className="text-[11px] text-muted-foreground">ใช้งานอยู่</span>
      </div>
      <Progress value={pct} className="mb-1.5 h-1.5" />
      <p className="mb-2 text-[11px] text-muted-foreground">
        เครดิตคงเหลือ {formatNumber(overviewStats.creditsUsed)} / {formatNumber(overviewStats.creditsTotal)}
      </p>
      <Button size="sm" variant="secondary" className="h-7 w-full text-xs">
        อัปเกรดแพ็กเกจ
      </Button>
    </div>
  );
}
