export type OpportunityScore = "สูง" | "ปานกลาง" | "ต่ำ";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  commission: number;
  velocity: number; // orders per day, mock
  score: OpportunityScore;
  saved?: boolean;
  source: "Shopee" | "TikTok Shop" | "Lazada";
  trend: number[]; // sparkline mock data
}

export const products: Product[] = [
  {
    id: "p1",
    name: "เซรั่มไนอาซินาไมด์ 10% ขวดปั๊ม 30ml",
    category: "ความงาม",
    price: 189,
    rating: 4.8,
    commission: 18,
    velocity: 412,
    score: "สูง",
    source: "Shopee",
    trend: [12, 18, 22, 30, 44, 58, 71],
  },
  {
    id: "p2",
    name: "หูฟังบลูทูธคล้องคอ กันน้ำ IPX5",
    category: "อิเล็กทรอนิกส์",
    price: 259,
    rating: 4.7,
    commission: 12,
    velocity: 268,
    score: "สูง",
    source: "TikTok Shop",
    trend: [40, 38, 42, 55, 60, 66, 80],
  },
  {
    id: "p3",
    name: "เก้าอี้พับอเนกประสงค์ปิกนิก",
    category: "บ้านและสวน",
    price: 349,
    rating: 4.5,
    commission: 9,
    velocity: 96,
    score: "ปานกลาง",
    source: "Shopee",
    trend: [10, 12, 11, 15, 18, 17, 22],
  },
  {
    id: "p4",
    name: "ผงโปรตีนพืชรสโกโก้ 900g",
    category: "สุขภาพ",
    price: 690,
    rating: 4.6,
    commission: 15,
    velocity: 154,
    score: "สูง",
    source: "Lazada",
    trend: [20, 25, 24, 33, 40, 52, 61],
  },
  {
    id: "p5",
    name: "ที่รัดผมกันเสียงหลุด 3 ชิ้น",
    category: "แฟชั่น",
    price: 59,
    rating: 4.9,
    commission: 22,
    velocity: 601,
    score: "สูง",
    source: "TikTok Shop",
    trend: [80, 90, 88, 95, 110, 130, 142],
  },
  {
    id: "p6",
    name: "แผ่นรองเมาส์ขนาดใหญ่ลายมินิมอล",
    category: "อุปกรณ์คอม",
    price: 129,
    rating: 4.3,
    commission: 10,
    velocity: 58,
    score: "ต่ำ",
    source: "Shopee",
    trend: [5, 6, 5, 7, 6, 8, 9],
  },
  {
    id: "p7",
    name: "ขวดน้ำสเตนเลสเก็บความเย็น 24 ชม.",
    category: "ไลฟ์สไตล์",
    price: 219,
    rating: 4.4,
    commission: 14,
    velocity: 203,
    score: "ปานกลาง",
    source: "Lazada",
    trend: [30, 28, 35, 40, 38, 45, 50],
  },
  {
    id: "p8",
    name: "แปรงขนนุ่มทำความสะอาดรองเท้า",
    category: "ไลฟ์สไตล์",
    price: 79,
    rating: 4.8,
    commission: 20,
    velocity: 331,
    score: "สูง",
    source: "Shopee",
    trend: [18, 22, 30, 33, 41, 50, 63],
  },
];

export interface SavedFolder {
  id: string;
  name: string;
  count: number;
}

export const savedFolders: SavedFolder[] = [
  { id: "f1", name: "รอบตัดสินใจสัปดาห์นี้", count: 6 },
  { id: "f2", name: "ของแต่งบ้านราคาต่ำกว่า 300", count: 4 },
  { id: "f3", name: "คอมมิชชั่นสูงกว่า 15%", count: 9 },
];

export interface MarketRow {
  id: string;
  name: string;
  type: "ร้านค้า" | "ครีเอเตอร์" | "ตลาดย่อย";
  density: number; // 0-100
  competitors: number;
  avgPrice: number;
}

export const marketRows: MarketRow[] = [
  { id: "m1", name: "ความงามเกาหลี - เซรั่มหน้าใส", type: "ตลาดย่อย", density: 82, competitors: 214, avgPrice: 199 },
  { id: "m2", name: "ร้าน Beautywhale.official", type: "ร้านค้า", density: 64, competitors: 12, avgPrice: 245 },
  { id: "m3", name: "ครีเอเตอร์ @kitchen.talk", type: "ครีเอเตอร์", density: 41, competitors: 3, avgPrice: 320 },
  { id: "m4", name: "อุปกรณ์ออกกำลังกายที่บ้าน", type: "ตลาดย่อย", density: 55, competitors: 88, avgPrice: 410 },
  { id: "m5", name: "ร้าน HomeCraft.th", type: "ร้านค้า", density: 37, competitors: 7, avgPrice: 180 },
];

export interface SignalSource {
  id: string;
  handle: string;
  platform: "Facebook" | "Instagram";
  followers: number;
  postsTracked: number;
  lastSignal: string;
  status: "กำลังติดตาม" | "หยุดชั่วคราว";
}

export const signalSources: SignalSource[] = [
  { id: "s1", handle: "@dailydeal.th", platform: "Facebook", followers: 182000, postsTracked: 342, lastSignal: "12 นาทีที่แล้ว", status: "กำลังติดตาม" },
  { id: "s2", handle: "@momshop.reviews", platform: "Instagram", followers: 64500, postsTracked: 128, lastSignal: "1 ชม.ที่แล้ว", status: "กำลังติดตาม" },
  { id: "s3", handle: "@gadget.spotter", platform: "Facebook", followers: 240000, postsTracked: 501, lastSignal: "3 ชม.ที่แล้ว", status: "กำลังติดตาม" },
  { id: "s4", handle: "@thai.lifestyle.picks", platform: "Instagram", followers: 39200, postsTracked: 76, lastSignal: "เมื่อวาน", status: "หยุดชั่วคราว" },
];

export interface ContentItem {
  id: string;
  title: string;
  platform: "Facebook" | "Instagram" | "TikTok";
  engagement: number;
  angle: string;
  postedAt: string;
}

export const contentTracker: ContentItem[] = [
  { id: "c1", title: "รีวิวเซรั่มไนอาซินาไมด์ 7 วันเห็นผล", platform: "TikTok", engagement: 18400, angle: "ก่อน-หลังใช้งาน", postedAt: "2 วันที่แล้ว" },
  { id: "c2", title: "หูฟังคล้องคอราคาไม่ถึง 300 คุ้มไหม", platform: "Facebook", engagement: 9200, angle: "รีวิวเปรียบเทียบราคา", postedAt: "4 วันที่แล้ว" },
  { id: "c3", title: "ของแต่งบ้านที่ซื้อแล้วไม่เสียใจ", platform: "Instagram", engagement: 6100, angle: "ลิสต์แนะนำ", postedAt: "5 วันที่แล้ว" },
  { id: "c4", title: "โปรตีนพืชกินยังไงให้ไม่เลี่ยน", platform: "TikTok", engagement: 12700, angle: "สอนวิธีใช้", postedAt: "1 สัปดาห์ที่แล้ว" },
];

export interface AdAngle {
  id: string;
  angle: string;
  hookExample: string;
  strength: number; // 0-100
  bestFor: string;
}

export const adAngles: AdAngle[] = [
  { id: "a1", angle: "แก้ปัญหาเฉพาะจุด", hookExample: "ผิวหมองคล้ำจากแดด แก้ยังไงใน 7 วัน", strength: 88, bestFor: "ความงาม, สุขภาพ" },
  { id: "a2", angle: "เปรียบเทียบราคา-คุณภาพ", hookExample: "ราคาเท่ากันแต่ได้เยอะกว่า ทำไมต้องซื้ออันนี้", strength: 74, bestFor: "อิเล็กทรอนิกส์" },
  { id: "a3", angle: "โชว์การใช้งานจริง", hookExample: "ใช้จริง 30 วัน สรุปให้ดูก่อนตัดสินใจ", strength: 81, bestFor: "ไลฟ์สไตล์" },
  { id: "a4", angle: "จำนวนจำกัด / ด่วน", hookExample: "รอบนี้เหลือไม่ถึง 50 ชิ้น", strength: 63, bestFor: "แฟชั่น" },
];

export interface Offer {
  id: string;
  productName: string;
  discount: string;
  commission: string;
  validUntil: string;
  status: "ฉบับร่าง" | "เผยแพร่แล้ว";
}

export const offers: Offer[] = [
  { id: "o1", productName: "เซรั่มไนอาซินาไมด์ 10%", discount: "ลด 15%", commission: "18%", validUntil: "20 ก.ค. 2026", status: "เผยแพร่แล้ว" },
  { id: "o2", productName: "ที่รัดผมกันเสียงหลุด 3 ชิ้น", discount: "ซื้อ 2 แถม 1", commission: "22%", validUntil: "18 ก.ค. 2026", status: "ฉบับร่าง" },
];

export interface OutreachThread {
  id: string;
  name: string;
  role: "ร้านค้า" | "ครีเอเตอร์" | "ซัพพลายเออร์";
  lastMessage: string;
  status: "รอตอบกลับ" | "ตกลงแล้ว" | "ปฏิเสธ";
  updatedAt: string;
}

export const outreachThreads: OutreachThread[] = [
  { id: "t1", name: "Beautywhale.official", role: "ร้านค้า", lastMessage: "สนใจค่ะ ขอรายละเอียดคอมมิชชั่นเพิ่มเติม", status: "รอตอบกลับ", updatedAt: "10 นาทีที่แล้ว" },
  { id: "t2", name: "@kitchen.talk", role: "ครีเอเตอร์", lastMessage: "ขอราคาซื้อขั้นต่ำก่อนตอบรับนะคะ", status: "รอตอบกลับ", updatedAt: "2 ชม.ที่แล้ว" },
  { id: "t3", name: "HomeCraft Supplier Co.", role: "ซัพพลายเออร์", lastMessage: "ตกลงเงื่อนไขเรียบร้อย เริ่มได้เลย", status: "ตกลงแล้ว", updatedAt: "เมื่อวาน" },
];

export interface ReportItem {
  id: string;
  name: string;
  range: string;
  createdAt: string;
  format: "PDF" | "CSV";
  size: string;
  status: "พร้อมดาวน์โหลด" | "กำลังสร้าง";
}

export const reports: ReportItem[] = [
  { id: "r1", name: "สรุปโอกาสสินค้ารายสัปดาห์", range: "1-7 ก.ค. 2026", createdAt: "8 ก.ค. 2026", format: "PDF", size: "1.2 MB", status: "พร้อมดาวน์โหลด" },
  { id: "r2", name: "รายงานความหนาแน่นตลาด", range: "มิ.ย. 2026", createdAt: "1 ก.ค. 2026", format: "CSV", size: "480 KB", status: "พร้อมดาวน์โหลด" },
  { id: "r3", name: "ผลตอบรับข้อเสนอสินค้า", range: "Q2 2026", createdAt: "30 มิ.ย. 2026", format: "PDF", size: "2.4 MB", status: "กำลังสร้าง" },
];

export const overviewStats = {
  creditsUsed: 12450,
  creditsTotal: 20000,
  planName: "Pro",
  renewsOn: "22 ก.ค. 2026",
  scannedToday: 3821,
  newOpportunities: 47,
  activeSignals: 18,
  savedProducts: 19,
};
