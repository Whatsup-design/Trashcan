// lib/mockData/admin/Dashboard.ts

export type ActivityItem = {
  id: string;
  device: string;
  action: string;
  time: string;
  status: "success" | "warning" | "error";
};

export type Test = {
  totalUsers: number;
  totalBottles: number;
  totalWeight: number;
  totalTokens: number;
};

export type FeedbackItem = {
  id: string;
  rating: number;
  comment: string;
  user: string;
  time: string;
};

export type AdminDashboardSummary = {
  totalUsers: number;
  totalBottles: number;
  totalWeight: number;
  totalTokens: number;
};

export type DashboardData = {
  totalDevices: number;
  bottlesToday: number;
  activeTokens: number;
  totalRecords: number;
  systemUptime: string;
  avgRating: number;
  recentActivity: ActivityItem[];
  recentFeedback: FeedbackItem[];
};


export const dashboardData: DashboardData = {
  totalDevices: 24,
  bottlesToday: 142,
  activeTokens: 18,
  totalRecords: 3847,
  systemUptime: "99.8%",
  avgRating: 4.3,
  recentActivity: [
    { id: "1", device: "Device A-01", action: "Bottle collected",    time: "2 mins ago",  status: "success" },
    { id: "2", device: "Device B-03", action: "Token redeemed",      time: "5 mins ago",  status: "success" },
    { id: "3", device: "Device A-02", action: "Low storage warning", time: "12 mins ago", status: "warning" },
    { id: "4", device: "Device C-01", action: "Device offline",      time: "1 hr ago",    status: "error"   },
    { id: "5", device: "Device B-01", action: "Bottle collected",    time: "1 hr ago",    status: "success" },
  ],
  recentFeedback: [
    { id: "1", rating: 5, comment: "Works great!", user: "User001", time: "1 hr ago"  },
    { id: "2", rating: 4, comment: "Good machine",  user: "User042", time: "3 hrs ago" },
    { id: "3", rating: 3, comment: "A bit slow",    user: "User018", time: "5 hrs ago" },
    { id: "4", rating: 5, comment: "Love it!",      user: "User007", time: "1 day ago" },
  ],
};