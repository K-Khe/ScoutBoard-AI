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
import { getApiKeys, setApiKey, removeApiKey, AIProvider } from "@/lib/crypto-store";

export default function SettingsPage() {
  const [provider, setProvider] = React.useState<AIProvider>("gemini");
  const [apiKeys, setApiKeys] = React.useState<Record<string, string>>({});
  const [inputValue, setInputValue] = React.useState("");
  const [hasUserTyped, setHasUserTyped] = React.useState(false);
  const [model, setModel] = React.useState("gemini-2.0-flash");

  // Load keys on mount
  React.useEffect(() => {
    getApiKeys().then((keys) => {
      setApiKeys(keys);
    });
  }, []);

  // Update input value when provider changes
  React.useEffect(() => {
    setHasUserTyped(false);
    const key = apiKeys[provider];
    if (key) {
      // Show first 4 characters of the real key, then mask the rest
      const prefix = key.substring(0, 4);
      setInputValue(`${prefix}••••••••••••••••`);
    } else {
      setInputValue("");
    }
  }, [provider, apiKeys]);

  const handleSave = async () => {
    if (!inputValue.includes("••••")) {
      if (inputValue.trim() === "") {
        if (hasUserTyped) {
          await removeApiKey(provider);
          setApiKeys((prev) => {
            const next = { ...prev };
            delete next[provider];
            return next;
          });
          toast("ลบ API Key แล้ว", { description: provider });
        } else {
          // User just focused (cleared by onFocus) and clicked Save without typing.
          // Restore the mask and skip to prevent data loss.
          const key = apiKeys[provider];
          if (key) {
            const prefix = key.substring(0, 4);
            setInputValue(`${prefix}••••••••••••••••`);
          }
          toast.info("ไม่ได้เปลี่ยนแปลง API Key");
        }
      } else {
        await setApiKey(provider, inputValue.trim());
        setApiKeys((prev) => ({ ...prev, [provider]: inputValue.trim() }));
        toast.success("บันทึก API Key สำเร็จ", { description: provider });
      }
    } else {
      toast.info("ไม่ได้เปลี่ยนแปลง API Key");
    }
  };

  const handleReset = async () => {
    await removeApiKey(provider);
    setApiKeys((prev) => {
      const next = { ...prev };
      delete next[provider];
      return next;
    });
    setInputValue("");
    toast("รีเซ็ตค่า AI แล้ว", { description: `ลบ Key ของ ${provider} แล้ว` });
  };

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
                  { id: "gemini" as AIProvider, name: "Gemini", hint: "เหมาะกับสรุป insight เร็ว" },
                  { id: "openai" as AIProvider, name: "OpenAI", hint: "เหมาะกับการร่างข้อความขาย" },
                  { id: "claude" as AIProvider, name: "Claude", hint: "เหมาะกับการวิเคราะห์ยาว" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProvider(item.id)}
                    className={`rounded-2xl border p-4 text-left transition ${provider === item.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/40"}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{item.name}</p>
                      {apiKeys[item.id] && (
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>ผู้ให้บริการ</Label>
                  <Input value={provider.charAt(0).toUpperCase() + provider.slice(1)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>โมเดล</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gemini-2.0-flash" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>API Key</Label>
                  {apiKeys[provider] ? (
                    <span className="text-[10px] font-medium text-success">บันทึกไว้แล้ว</span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground">ยังไม่ได้ตั้งค่า</span>
                  )}
                </div>
                <Input 
                  value={inputValue} 
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasUserTyped(true);
                  }}
                  onFocus={() => {
                    if (inputValue.includes("••••")) {
                      setInputValue("");
                    }
                  }}
                  placeholder="วาง key ของคุณที่นี่" 
                  type="text" 
                />
              </div>

              <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-primary/80">
                <strong>ข้อมูลความปลอดภัย:</strong> เพื่อความสะดวก คีย์ของคุณจะถูกเข้ารหัสระดับพื้นฐาน (Obfuscation) 
                และเก็บไว้ในเบราว์เซอร์นี้ (ไม่ส่งไปเซิร์ฟเวอร์ส่วนกลาง) โปรดระมัดระวังหากใช้งานบนเครื่องสาธารณะ
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleReset}>
                  รีเซ็ต
                </Button>
                <Button onClick={handleSave}>
                  บันทึก API Key
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
