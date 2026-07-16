"use client";
import * as React from "react";
import { toast } from "sonner";
import {
  Menu,
  Search,
  Download,
  Globe,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar";
import { CommandSearch } from "@/components/layout/command-search";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [lang, setLang] = React.useState<"TH" | "EN">("TH");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-muted/50 px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">ค้นหาเมนู, สินค้า, คำสั่ง...</span>
        <span className="sm:hidden">ค้นหา</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden sm:inline-flex"
          onClick={() => toast("มีสัญญาณใหม่ 3 รายการจากแหล่งที่ติดตาม", { description: "ตรวจสอบได้ที่แหล่งสัญญาณโซเชียล" })}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-signal" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hidden items-center gap-1.5 lg:inline-flex"
          onClick={() => setLang(lang === "TH" ? "EN" : "TH")}
        >
          <Globe className="h-4 w-4" />
          {lang}
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">ส่งออก</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ส่งออกข้อมูลปัจจุบัน</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.success("กำลังสร้างไฟล์ CSV", { description: "ระบบจะแจ้งเตือนเมื่อพร้อมดาวน์โหลด" })}>
              ส่งออกเป็น CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("กำลังสร้างไฟล์ PDF", { description: "ระบบจะแจ้งเตือนเมื่อพร้อมดาวน์โหลด" })}>
              ส่งออกเป็น PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">วส</AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-xs font-medium">วรรษวัง</span>
                <span className="block text-[11px] text-muted-foreground">เจ้าของบัญชี</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <span>บัญชีของฉัน</span>
              <Badge variant="signal" className="text-[10px]">Pro</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" /> ข้อมูลโปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="h-4 w-4" /> การเรียกเก็บเงิน
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
