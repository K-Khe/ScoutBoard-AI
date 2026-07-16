import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, BookOpen, Chrome, Sparkles, ShieldAlert, Wrench } from "lucide-react";

const plans = [
  { name: "Starter", price: "ฟรี", features: ["สแกนสินค้า 100 ชิ้น/เดือน", "ติดตามแหล่งสัญญาณ 3 บัญชี", "รายงานพื้นฐาน"] },
  { name: "Pro", price: "1,290 บาท/เดือน", features: ["สแกนสินค้าไม่จำกัด", "ติดตามแหล่งสัญญาณ 20 บัญชี", "อินไซต์ AI และวิเคราะห์มุมโฆษณา"], highlighted: true },
  { name: "Lifetime", price: "9,990 บาท ครั้งเดียว", features: ["สิทธิ์ใช้งานตลอดชีพ", "ทุกฟีเจอร์ของแพ็กเกจ Pro", "อัปเดตฟีเจอร์ใหม่ตลอดอายุการใช้งาน"] },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">คู่มือและแพ็กเกจ</h1>
        <p className="mt-1 text-sm text-muted-foreground">เริ่มต้นใช้งาน ScoutBoard และเลือกแพ็กเกจที่เหมาะกับคุณ</p>
      </div>

      <Tabs defaultValue="guide">
        <TabsList>
          <TabsTrigger value="guide">คู่มือใช้งาน</TabsTrigger>
          <TabsTrigger value="pricing">แพ็กเกจ</TabsTrigger>
        </TabsList>

        <TabsContent value="guide">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-signal" />
                  <p className="font-display text-sm font-semibold">ขั้นตอนติดตั้งเริ่มต้น</p>
                </div>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. ติดตั้ง TrendRadar Connector แบบ unpacked ใน Chrome</li>
                  <li>2. เตรียมบัญชี Shopee Affiliate หรือไฟล์ CSV/Datafeed สำหรับนำเข้า</li>
                  <li>3. เริ่มสแกนและคัดสินค้าในหน้าภาพรวมกับ Product Finder</li>
                </ol>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-signal" />
                  <p className="font-display text-sm font-semibold">การใช้งานแต่ละโมดูล</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  แต่ละเมนูในแถบด้านซ้ายถูกจัดกลุ่มตามขั้นตอนการทำงานจริง ตั้งแต่การค้นหาโอกาสสินค้า
                  วิเคราะห์เนื้อหา ไปจนถึงการวางแผนแคมเปญและติดต่อพันธมิตร
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Chrome className="h-4 w-4 text-signal" />
                  <p className="font-display text-sm font-semibold">Chrome Connector</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  เปิด <span className="font-medium text-foreground">chrome://extensions</span> แล้วกด Load unpacked เพื่อโหลดส่วนขยาย
                  จากนั้นให้ผู้ใช้ล็อกอินบัญชีของตัวเองเพื่อดึงข้อมูลจากหน้า Affiliate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-signal" />
                  <p className="font-display text-sm font-semibold">AI แบบไม่ผูกคีย์กลาง</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  ใส่ Gemini, OpenAI หรือ Claude key ของลูกค้าเฉพาะตอนใช้งาน AI หนัก และอย่าเก็บ key ลง Git หรือไฟล์ส่งมอบ
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                  ข้อมูลที่ใช้ในการทดสอบควรเป็นข้อมูลที่ผู้ใช้มีสิทธิ์นำเข้าและประมวลผลได้
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.highlighted ? "border-signal ring-1 ring-signal/40" : ""}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-display text-base font-semibold">{plan.name}</p>
                    {plan.highlighted && <Badge variant="signal">แนะนำ</Badge>}
                  </div>
                  <p className="mb-4 font-display text-xl font-bold">{plan.price}</p>
                  <ul className="mb-5 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.highlighted ? "default" : "outline"} className="w-full">
                    เลือกแพ็กเกจนี้
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
