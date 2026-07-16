import {
  LayoutGrid,
  Radar,
  SearchCode,
  Bookmark,
  Store,
  Rss,
  Plug,
  FileVideo2,
  Sparkles,
  Megaphone,
  Tag,
  CalendarClock,
  Send,
  FileBarChart,
  Settings2,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  sub: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "เรดาร์สินค้า",
    items: [
      { label: "ภาพรวม", sub: "Overview", href: "/", icon: LayoutGrid },
      { label: "ตั้งค่าเรดาร์", sub: "Radar setup", href: "/radar-setup", icon: Radar },
      { label: "ค้นหาโอกาสสินค้า", sub: "Product finder", href: "/product-finder", icon: SearchCode },
      { label: "สินค้าที่บันทึกไว้", sub: "Saved products", href: "/saved-products", icon: Bookmark },
      { label: "ความหนาแน่นตลาด", sub: "Market density", href: "/market-density", icon: Store },
      { label: "แหล่งสัญญาณโซเชียล", sub: "Signal sources", href: "/signal-sources", icon: Rss },
      { label: "เชื่อมต่อข้อมูล", sub: "Data connections", href: "/connect-data", icon: Plug },
    ],
  },
  {
    title: "วิเคราะห์เนื้อหา",
    items: [
      { label: "ติดตามคอนเทนต์ขายดี", sub: "Content tracker", href: "/content-tracker", icon: FileVideo2 },
      { label: "อินไซต์สินค้าอัตโนมัติ", sub: "AI product insight", href: "/product-insight", icon: Sparkles, badge: "AI" },
      { label: "วิเคราะห์มุมโฆษณา", sub: "Ad angle analysis", href: "/ad-angles", icon: Megaphone },
    ],
  },
  {
    title: "วางแผนแคมเปญ",
    items: [
      { label: "สร้างข้อเสนอสินค้า", sub: "Product offers", href: "/offers", icon: Tag },
      { label: "วางแผนคอนเทนต์แอฟฟิลิเอต", sub: "Content planner", href: "/content-planner", icon: CalendarClock },
      { label: "ข้อความติดต่อพันธมิตร", sub: "Outreach", href: "/outreach", icon: Send },
    ],
  },
  {
    title: "จัดการระบบ",
    items: [
      { label: "รายงานและส่งออก", sub: "Reports", href: "/reports", icon: FileBarChart },
      { label: "ตั้งค่าระบบ", sub: "Settings", href: "/settings", icon: Settings2 },
    ],
  },
  {
    title: "ช่วยเหลือ",
    items: [{ label: "คู่มือและแพ็กเกจ", sub: "Help & plans", href: "/help", icon: LifeBuoy }],
  },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
