// components/user/dashboard/types.ts

export type UserDashboardData = {
  bottlesThrown: number;   // จำนวนขวดที่ทิ้งทั้งหมด
  weightGram: number;      // น้ำหนักรวมกรัม
  tokensBalance: number;   // token คงเหลือ
  leaderboardRank: number; // อันดับ leaderboard
  totalUsers: number;      // จำนวน user ทั้งหมด (สำหรับแสดง "3rd of 120")
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "warning" | "success";
};