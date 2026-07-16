"use client";
import * as React from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { outreachThreads } from "@/lib/mock-data";

const statusVariant: Record<string, "outline" | "success" | "destructive"> = {
  รอตอบกลับ: "outline",
  ตกลงแล้ว: "success",
  ปฏิเสธ: "destructive",
};

export default function OutreachPage() {
  const [open, setOpen] = React.useState(false);
  const [to, setTo] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">ข้อความติดต่อพันธมิตร</h1>
          <p className="mt-1 text-sm text-muted-foreground">ติดตามการติดต่อร้านค้า ครีเอเตอร์ และซัพพลายเออร์ในที่เดียว</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Send className="h-4 w-4" /> ส่งข้อความใหม่
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ส่งข้อความติดต่อ</DialogTitle>
              <DialogDescription>ระบุชื่อผู้รับและข้อความที่ต้องการส่ง</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="to">ชื่อผู้รับ</Label>
                <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="เช่น ชื่อร้านค้าหรือครีเอเตอร์" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg">ข้อความ</Label>
                <textarea
                  id="msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="เขียนข้อความแนะนำตัวและข้อเสนอโดยย่อ..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                ยกเลิก
              </Button>
              <Button
                disabled={!to || !message}
                onClick={() => {
                  toast.success("ส่งข้อความแล้ว", { description: `ถึง ${to}` });
                  setTo("");
                  setMessage("");
                  setOpen(false);
                }}
              >
                ส่งข้อความ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SectionHeader title="บทสนทนาทั้งหมด" />

      <div className="flex flex-col gap-3">
        {outreachThreads.map((t) => (
          <Card key={t.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-3 p-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">{t.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <span className="text-xs text-muted-foreground">{t.updatedAt}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{t.lastMessage}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{t.role}</Badge>
                  <Badge variant={statusVariant[t.status]} className="text-[10px]">{t.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
