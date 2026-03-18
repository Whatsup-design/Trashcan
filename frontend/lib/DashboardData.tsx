// lib/dashboardData.ts
// ─────────────────────────────────────────────────────────
// Mockup data สำหรับ Dashboard
// ตอน connect Supabase จริง แค่เปลี่ยน return ใน getDashboardData()
// โครงสร้างข้อมูลเหมือนเดิมทุกอย่าง ไม่ต้องแก้ component เลย
// ─────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────
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

// ── Mockup Data ───────────────────────────────────────────
export async function getDashboardData(): Promise<DashboardData> {
  return {
    // ── Stat Cards
    totalDevices: 24,
    bottlesToday: 142,   // ยังเก็บค่าไว้ — พร้อม connect chart ทีหลัง
    activeTokens: 18,
    totalRecords: 3847,
    systemUptime: "99.8%",
    avgRating: 4.3,

    // ── Recent Activity
    recentActivity: [
      { id: "1", device: "Device A-01", action: "Bottle collected",    time: "2 mins ago",  status: "success" },
      { id: "2", device: "Device B-03", action: "Token redeemed",      time: "5 mins ago",  status: "success" },
      { id: "3", device: "Device A-02", action: "Low storage warning", time: "12 mins ago", status: "warning" },
      { id: "4", device: "Device C-01", action: "Device offline",      time: "1 hr ago",    status: "error"   },
      { id: "5", device: "Device B-01", action: "Bottle collected",    time: "1 hr ago",    status: "success" },
    ],

    // ── Feedback
    recentFeedback: [
      { id: "1", device: "Device A-01", rating: 5, comment: "Works great!", user: "User001", time: "1 hr ago"  },
      { id: "2", device: "Device B-03", rating: 4, comment: "Good machine",  user: "User042", time: "3 hrs ago" },
      { id: "3", device: "Device A-02", rating: 3, comment: "A bit slow",    user: "User018", time: "5 hrs ago" },
      { id: "4", device: "Device C-01", rating: 5, comment: "Love it!",      user: "User007", time: "1 day ago" },
    ],
  };
}