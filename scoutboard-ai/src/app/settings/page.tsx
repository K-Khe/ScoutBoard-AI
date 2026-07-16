"use client";
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [provider, setProvider] = React.useState("Gemini");
  const [apiKey, setApiKey] = React.useState("");
  const [model, setModel] = React.useState("gemini-2.0-flash");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ตั้งค่าระบบ</h1>
        <p className="mt-1 text-sm text-muted-foreground">จัดการโปรไฟล์ การแจ้งเตือน ความปลอดภัย และ AI API แบบแยกตามผู้ใช้</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">โปรไฟล์</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
          <TabsTrigger value="ai">AI API</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              <CardDescription>ข้อมูลนี้จะแสดงในบัญชีของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>ชื่อที่แสดง</Label>
                  <Input defaultValue="วรรษวัง" />
                </div>
                <div className="space-y-2">
                  <Label>อีเมล</Label>
                  <Input defaultValue="wansavang@example.com" type="email" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("บันทึกโปรไฟล์แล้ว")}>บันทึกการเปลี่ยนแปลง</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>เลือกช่องทางและเหตุการณ์ที่ต้องการรับการแจ้งเตือน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "อีเมลสรุปรายสัปดาห์", desc: "สรุปโอกาสสินค้าและสัญญาณใหม่ทุกวันจันทร์" },
                { label: "แจ้งเตือนเมื่อพบโอกาสสูง", desc: "แจ้งเตือนทันทีผ่านระบบเมื่อพบสินค้าคะแนนสูง" },
              ].map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-muted-foreground">{row.desc}</p>
                    </div>
                    <Switch defaultChecked={i === 1} />
                  </div>
                  {i === 0 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>AI API Settings</CardTitle>
              <CardDescription>ใส่คีย์ของตัวเองเฉพาะกรณีใช้การสรุป insight, ร่างแผนขาย หรือ workflow AI หนัก</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { name: "Gemini", hint: "เหมาะกับสรุป insight เร็ว" },
                  { name: "OpenAI", hint: "เหมาะกับการร่างข้อความขาย" },
                  { name: "Claude", hint: "เหมาะกับการวิเคราะห์ยาว" },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setProvider(item.name)}
                    className={`rounded-2xl border p-4 text-left transition ${provider === item.name ? "border-primary bg-primary/5" : "hover:border-muted-foreground/40"}`}
                  >
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>ผู้ให้บริการ</Label>
                  <Input value={provider} onChange={(e) => setProvider(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>โมเดล</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gemini-2.0-flash" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>API key</Label>
                <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="วาง key ของคุณที่นี่" type="password" />
              </div>

              <div className="rounded-2xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                ระบบนี้ไม่เก็บ key ลงในโน้ต, Git หรือไฟล์ส่งมอบ การบันทึกค่าเป็นแค่ local settings ของผู้ใช้เท่านั้น
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast("รีเซ็ตค่า AI แล้ว", { description: "ล้าง provider/model/key ชั่วคราว" })}>
                  รีเซ็ต
                </Button>
                <Button onClick={() => toast.success("บันทึก AI API แล้ว", { description: `${provider} · ${model}` })}>
                  บันทึก AI API
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>ความปลอดภัย</CardTitle>
              <CardDescription>จัดการรหัสผ่านและการยืนยันตัวตนสองชั้น</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>รหัสผ่านใหม่</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">ยืนยันตัวตนสองชั้น</p>
                  <p className="text-xs text-muted-foreground">เพิ่มความปลอดภัยด้วยรหัส OTP ทุกครั้งที่เข้าสู่ระบบ</p>
                </div>
                <Switch />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success("อัปเดตความปลอดภัยแล้ว")}>บันทึก</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
