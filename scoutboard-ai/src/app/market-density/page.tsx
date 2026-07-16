import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { marketRows } from "@/lib/mock-data";
import { formatCurrencyTHB, formatNumber } from "@/lib/utils";

function densityTone(density: number) {
  if (density >= 70) return "destructive";
  if (density >= 45) return "secondary";
  return "success";
}

export default function MarketDensityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ความหนาแน่นตลาด</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ดูระดับการแข่งขันของตลาดย่อย ร้านค้า และครีเอเตอร์ ก่อนตัดสินใจเข้าไปทำตลาด
        </p>
      </div>

      <SectionHeader title="ภาพรวมความหนาแน่น" subtitle="ยิ่งเปอร์เซ็นต์สูง ยิ่งมีการแข่งขันมาก" />

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อ</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>ความหนาแน่น</TableHead>
              <TableHead>คู่แข่ง</TableHead>
              <TableHead className="text-right">ราคาเฉลี่ย</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{row.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={densityTone(row.density) as any}>{row.density}%</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatNumber(row.competitors)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrencyTHB(row.avgPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
