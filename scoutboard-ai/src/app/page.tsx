"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UploadCloud, Radar, Sparkles, Bookmark, Rss, TrendingUp, ArrowRight, ScanSearch, Files, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProductCard } from "@/components/dashboard/product-card";
import { ScanLoader } from "@/components/dashboard/scan-loader";
import { UploadDialog } from "@/components/dashboard/upload-dialog";
import { products, signalSources, contentTracker, overviewStats } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const workflow = [
  {
    title: "1. เตรียมข้อมูล",
    desc: "อัปโหลด CSV/Datafeed หรือโหลด Chrome Connector เพื่อดึงจาก Shopee Affiliate",
    action: { label: "ไปที่เชื่อมต่อข้อมูล", href: "/connect-data" },
    icon: Files,
  },
  {
    title: "2. สแกนสัญญาณ",
    desc: "ให้ระบบอ่าน feed, affiliate และสัญญาณเสริมเข้าคลัง local",
    action: { label: "เริ่มสแกน", href: "/connect-data" },
    icon: ScanSearch,
  },
  {
    title: "3. คัดสินค้า",
    desc: "ใช้ Product Finder เพื่อกรองสินค้า ราคา ยอดขาย และคอมมิชชั่น",
    action: { label: "เปิด Product Finder", href: "/product-finder" },
    icon: TrendingUp,
  },
  {
    title: "4. สรุปแผนขาย",
    desc: "ร่าง insight, angle และรายงานก่อน export ออกไปใช้งาน",
    action: { label: "ดูรายงาน", href: "/reports" },
    icon: WandSparkles,
  },
];

export default function OverviewPage() {
  const [scanning, setScanning] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);

  function runScan() {
    setScanning(true);
    setScanned(false);
    toast("เริ่มสแกน Shopee Feed แล้ว", { description: "ระบบกำลังตรวจสอบสัญญาณล่าสุด" });
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      toast.success("สแกนเสร็จสิ้น", { description: "พบสินค้าที่มีแนวโน้มดี 47 รายการ" });
    }, 2200);
  }

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ภาพรวมการสแกน</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ติดตามโอกาสสินค้าและสัญญาณคอนเทนต์จากตลาดออนไลน์และโซเชียลมีเดียแบบเรียลไทม์
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <UploadDialog>
            <Button variant="outline">
              <UploadCloud className="h-4 w-4" />
              นำเข้าไฟล์ CSV
            </Button>
          </UploadDialog>
          <Button onClick={runScan} disabled={scanning}>
            <Radar className="h-4 w-4" />
            {scanning ? "กำลังสแกน..." : "เริ่มสแกน Shopee Feed"}
          </Button>
        </div>
      </motion.div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Local-first workflow</p>
              <p className="text-xs text-muted-foreground">
                ข้อมูลจะไหลจากการนำเข้า -&gt; สแกน -&gt; คัดสินค้า -&gt; รายงาน โดยไม่ต้องพึ่ง backend ภายนอกในขั้นทดสอบ
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <ArrowRight className="h-3 w-3" />
              เริ่มจากเชื่อมต่อข้อมูล
            </Badge>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {workflow.map((step) => (
              <div key={step.title} className="rounded-2xl border bg-background/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <step.icon className="h-4 w-4" />
                  </div>
                </div>
                <Button asChild variant="ghost" className="mt-3 h-8 w-full justify-start px-0 text-sm">
                  <Link href={step.action.href}>{step.action.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="สแกนวันนี้" value={formatNumber(overviewStats.scannedToday)} delta="+12.4% จากเมื่อวาน" icon={Radar} index={0} tone="signal" />
        <StatCard label="โอกาสสินค้าใหม่" value={String(overviewStats.newOpportunities)} delta="+8 รายการ" icon={Sparkles} index={1} tone="teal" />
        <StatCard label="แหล่งสัญญาณที่ใช้งาน" value={String(overviewStats.activeSignals)} icon={Rss} index={2} />
        <StatCard label="สินค้าที่บันทึกไว้" value={String(overviewStats.savedProducts)} icon={Bookmark} index={3} />
      </div>

      {scanning && <ScanLoader label="กำลังอ่านข้อมูล Shopee Feed" hint="ระบบกำลังตรวจสอบว่ามีข้อมูลใหม่เข้ามาหรือไม่" />}

      {!scanning && (
        <Tabs defaultValue="products">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="products">สินค้ามาแรง</TabsTrigger>
              <TabsTrigger value="signals">แหล่งสัญญาณล่าสุด</TabsTrigger>
              <TabsTrigger value="content">คอนเทนต์ที่ถูกพูดถึง</TabsTrigger>
            </TabsList>
            {scanned && (
              <Badge variant="signal" className="gap-1">
                <TrendingUp className="h-3 w-3" /> อัปเดตล่าสุดเมื่อครู่นี้
              </Badge>
            )}
          </div>

          <TabsContent value="products">
            <SectionHeader
              title="สินค้าที่มีแนวโน้มดีที่สุด"
              subtitle="เรียงตามอัตราเร่งของออเดอร์ในช่วง 7 วันที่ผ่านมา"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signals">
            <SectionHeader title="แหล่งสัญญาณที่มีความเคลื่อนไหวล่าสุด" subtitle="บัญชี Facebook และ Instagram ที่ระบบติดตามอยู่" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {signalSources.map((s) => (
                <Card key={s.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-display text-sm font-semibold">{s.handle}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.platform} · {formatNumber(s.followers)} ผู้ติดตาม
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={s.status === "กำลังติดตาม" ? "success" : "outline"}>{s.status}</Badge>
                      <p className="mt-1 text-[11px] text-muted-foreground">{s.lastSignal}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content">
            <SectionHeader title="คอนเทนต์ที่มีเอนเกจเมนต์สูงในสัปดาห์นี้" subtitle="ใช้เป็นไอเดียสำหรับวางแผนคอนเทนต์ถัดไป" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contentTracker.map((c) => (
                <Card key={c.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">{c.platform}</Badge>
                      <span className="text-xs text-muted-foreground">{c.postedAt}</span>
                    </div>
                    <p className="font-display text-sm font-semibold leading-snug">{c.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">มุมคอนเทนต์: {c.angle}</p>
                    <p className="mt-2 text-sm font-medium text-teal">{formatNumber(c.engagement)} เอนเกจเมนต์</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
