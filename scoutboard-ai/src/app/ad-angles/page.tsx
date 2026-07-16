import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/dashboard/section-header";
import { adAngles } from "@/lib/mock-data";

export default function AdAnglesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">วิเคราะห์มุมโฆษณา</h1>
        <p className="mt-1 text-sm text-muted-foreground">มุมนำเสนอที่ได้ผลดีที่สุดในแต่ละหมวดสินค้า จากการวิเคราะห์คอนเทนต์ที่ผ่านมา</p>
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
