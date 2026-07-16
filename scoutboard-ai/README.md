# ScoutBoard AI

แดชบอร์ดสแกนโอกาสสินค้าและสัญญาณคอนเทนต์จากตลาดออนไลน์และโซเชียลมีเดีย
(Frontend ทั้งหมดใช้ Mock Data — ไม่มีการเชื่อมต่อ Backend จริง)

โปรเจกต์นี้ถูกออกแบบใหม่ทั้งหมด (UI, โครงสร้าง, ชื่อแบรนด์, เนื้อหา) โดยอ้างอิงเพียง
"โครงสร้างหน้าจอและรูปแบบการใช้งาน" ของแดชบอร์ดประเภทเดียวกัน ไม่ได้คัดลอกโค้ด ข้อความ
รูปภาพ หรือโลโก้จากเว็บไซต์ต้นฉบับใด ๆ

## เทคโนโลยีที่ใช้
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- Framer Motion (animation)
- Lucide React (icons)
- next-themes (dark mode)
- sonner (toast notifications)
- cmdk (command palette / search)

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## โครงสร้างโปรเจกต์

```
src/
  app/                 # ทุกหน้า (App Router) แต่ละโฟลเดอร์ = 1 เส้นทาง
  components/
    ui/                # shadcn/ui primitives (button, card, dialog, ...)
    layout/            # sidebar, topbar, dashboard shell, command search
    dashboard/         # stat-card, product-card, upload-dialog, scan-loader ...
    theme-provider.tsx
    theme-toggle.tsx
  lib/
    mock-data.ts       # ข้อมูลจำลองทั้งหมด
    utils.ts
```

## ฟีเจอร์ที่ทำ interaction ไว้ครบ
- Sidebar แบบยุบ/ขยายได้ (desktop) และ Sheet แบบเลื่อนเข้า (mobile)
- Topbar: ค้นหาแบบ Command Palette (⌘K), สลับภาษา, สลับ Dark Mode, เมนูส่งออก, เมนูผู้ใช้
- Tabs, Dropdown filter, Dialog/Modal (นำเข้าไฟล์ CSV, สร้างข้อเสนอ, เพิ่มแหล่งสัญญาณ ฯลฯ)
- Toast Notification (sonner) สำหรับทุก action หลัก
- Loading state จำลอง (scan loader + skeleton) ระหว่าง "สแกน" ข้อมูล
- Scroll-reveal animation ด้วย Framer Motion บนการ์ดและสถิติ
- Hover effects บนการ์ดสินค้า, ปุ่ม, แถวตาราง
- Responsive เต็มรูปแบบ: mobile, tablet, desktop
