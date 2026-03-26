{/* Admin ActivityLog types */}
export type ActivityLog = {
  id: string;
  studentId: string;    // รหัสนักศึกษา
  name: string;         // ชื่อ
  action: string;       // สิ่งที่เกิดขึ้น เช่น "Bottle collected"
  time: string;         // เวลา HH:MM
  tokenReceived: number; // token ที่ได้รับ
  gramOfBottle: number;  // น้ำหนักขวด (กรัม)
};
{/* Admin Dashboard Type */}

export type ActivityItem = {
  id: string;
  device: string;       // ชื่อ device
  action: string;       // สิ่งที่เกิดขึ้น เช่น "Bottle collected"
  time: string;         // เวลา เช่น "2 mins ago"
  status: "success" | "warning" | "error";
};

export type FeedbackItem = {
  id: string;
  device: string;       // ชื่อ device ที่ได้รับ feedback
  rating: number;       // คะแนน 1-5
  comment: string;      // ความคิดเห็น
  user: string;         // ชื่อ user
  time: string;
};

export type DashboardData = {
  // ── Stat Cards ────────────────────────────────────────
  totalDevices: number;
  bottlesToday: number;  // ยังเก็บไว้ — แค่ยังไม่ใช้ chart
  activeTokens: number;
  totalRecords: number;
  systemUptime: string;
  avgRating: number;

  // ── Tables ────────────────────────────────────────────
  recentActivity: ActivityItem[];
  recentFeedback: FeedbackItem[];
};


{/* Admin bottle type*/}
export type BottleChartPoint = {
  date: string;       // วันที่ เช่น "Mon", "Jan 1"
  total: number;      // รวมทุกประเภท
  plastic: number;    // พลาสติก
  glass: number;      // แก้ว
  aluminum: number;   // อลูมิเนียม
};
export type BottleChartData = {
  week:  BottleChartPoint[];  // ข้อมูล 7 วัน
  month: BottleChartPoint[];  // ข้อมูล 30 วัน
  all:   BottleChartPoint[];  // ข้อมูลทั้งหมด
};
export type BottleSummaryData = {
  total: number;        // รวมทั้งหมด
  thisWeek: number;     // สัปดาห์นี้
  thisMonth: number;    // เดือนนี้
  plastic: number;      // ขวดพลาสติก
  glass: number;        // ขวดแก้ว
  aluminum: number;     // กระป๋องอลูมิเนียม
};

{/* Admin data type */}

export type DataRow = {
  id: string;
  rfidUid: string;      // RFID UID
  studentId: string;    // รหัสนักศึกษา
  name: string;         // ชื่อ
  bottles: number;      // จำนวนขวด
  tokens: number;       // จำนวน token
};