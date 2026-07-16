import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/dashboard/section-header";
import { contentTracker } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function ContentTrackerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ติดตามคอนเทนต์ขายดี</h1>
        <p className="mt-1 text-sm text-muted-foreground">คอนเทนต์ที่เกี่ยวข้องกับสินค้าในเรดาร์ พร้อมมุมนำเสนอที่ใช้</p>
      </div>

      <SectionHeader title="คอนเทนต์ที่มีเอนเกจเมนต์สูง" subtitle="เรียงตามจำนวนเอนเกจเมนต์ล่าสุด" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contentTracker.map((c) => (
          <Card key={c.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary">{c.platform}</Badge>
                <span className="text-xs text-muted-foreground">{c.postedAt}</span>
              </div>
              <p className="font-display text-sm font-semibold leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">มุมคอนเทนต์: {c.angle}</p>
              <p className="mt-3 text-sm font-medium text-teal">{formatNumber(c.engagement)} เอนเกจเมนต์</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
