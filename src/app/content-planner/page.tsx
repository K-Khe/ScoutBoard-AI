"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/section-header";

interface PlanItem {
  id: string;
  title: string;
  platform: string;
  date: string;
}

const columns: { id: "idea" | "writing" | "scheduled"; label: string; items: PlanItem[] }[] = [
  {
    id: "idea",
    label: "แนวคิด",
    items: [
      { id: "i1", title: "รีวิวขวดน้ำเก็บความเย็น เทียบ 3 แบรนด์", platform: "TikTok", date: "-" },
      { id: "i2", title: "ของแต่งบ้านงบไม่เกิน 300 ที่คุ้มค่า", platform: "Instagram", date: "-" },
    ],
  },
  {
    id: "writing",
    label: "กำลังเขียน",
    items: [{ id: "w1", title: "สอนใช้โปรตีนพืชสำหรับมือใหม่", platform: "TikTok", date: "12 ก.ค." }],
  },
  {
    id: "scheduled",
    label: "จัดคิวแล้ว",
    items: [{ id: "s1", title: "รีวิวเซรั่มไนอาซินาไมด์ 7 วัน", platform: "Facebook", date: "14 ก.ค." }],
  },
];

export default function ContentPlannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">วางแผนคอนเทนต์แอฟฟิลิเอต</h1>
          <p className="mt-1 text-sm text-muted-foreground">จัดลำดับคอนเทนต์ตั้งแต่แนวคิดจนถึงวันเผยแพร่</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" /> เพิ่มคอนเทนต์
        </Button>
      </div>

      <SectionHeader title="กระดานวางแผน" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{col.label}</p>
              <span className="text-xs text-muted-foreground">{col.items.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {col.items.map((item) => (
                <Card key={item.id} className="cursor-grab transition-shadow hover:shadow-md active:cursor-grabbing">
                  <CardContent className="p-3.5">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px]">{item.platform}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {col.items.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  ยังไม่มีรายการ
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
