import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Database } from "lucide-react";
import { adAngles } from "@/lib/mock-data";

export default function AdAnglesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">วิเคราะห์มุมโฆษณา</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/75">มุมนำเสนอที่ได้ผลดีที่สุดในแต่ละหมวดสินค้า จากการวิเคราะห์คอนเทนต์ที่ผ่านมา</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-white/20 text-xs text-white/60">
              <Database className="h-3 w-3" /> ข้อมูลตัวอย่าง
            </Badge>
            <Button variant="secondary" size="sm" disabled className="opacity-50">
              สกัดมุมมองจากคอมเมนต์ (เร็วๆ นี้)
            </Button>
          </div>
        </div>
      </div>

      <SectionHeader title="มุมโฆษณาที่แนะนำ" subtitle="เรียงตามความแข็งแรงของมุมนำเสนอ" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {adAngles.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{a.angle}</p>
                <span className="text-sm font-medium text-signal">{a.strength}</span>
              </div>
              <Progress value={a.strength} className="mb-3 h-1.5" />
              <p className="text-sm text-muted-foreground">ตัวอย่างประโยคเปิด: &ldquo;{a.hookExample}&rdquo;</p>
              <p className="mt-2 text-xs text-muted-foreground">เหมาะกับ: {a.bestFor}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
