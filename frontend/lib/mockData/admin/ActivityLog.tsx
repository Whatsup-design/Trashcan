export type ActivityAction = "Bottle collected" | "Tokens redeemed";

export type ActivityLog = {
  Student_ID: number;
  Student_Name: string;
  action: ActivityAction;
  tokens: number;
  weight: number;
  created_at: string;
};

const ActivityLogMockData: ActivityLog[] = [
  { Student_ID: 64010001, Student_Name: "Somchai Jaidee", action: "Bottle collected", tokens: 2, weight: 35, created_at: "2026-03-31T08:12:00" },
  { Student_ID: 64010002, Student_Name: "Malee Srisuwan", action: "Bottle collected", tokens: 2, weight: 42, created_at: "2026-03-31T08:45:00" },
  { Student_ID: 64010003, Student_Name: "Nattapong Khamdi", action: "Tokens redeemed", tokens: -10, weight: 0, created_at: "2026-03-31T09:10:00" },
  { Student_ID: 64010004, Student_Name: "Pornpan Rodpai", action: "Bottle collected", tokens: 2, weight: 38, created_at: "2026-03-31T09:33:00" },
  { Student_ID: 65010001, Student_Name: "Piyaphat Charoen", action: "Bottle collected", tokens: 2, weight: 44, created_at: "2026-03-31T10:05:00" },
  { Student_ID: 64010005, Student_Name: "Wichai Thongdee", action: "Bottle collected", tokens: 2, weight: 31, created_at: "2026-03-31T10:22:00" },
  { Student_ID: 65010002, Student_Name: "Supansa Wongpan", action: "Bottle collected", tokens: 2, weight: 39, created_at: "2026-03-31T10:48:00" },
  { Student_ID: 64010001, Student_Name: "Somchai Jaidee", action: "Bottle collected", tokens: 2, weight: 36, created_at: "2026-03-31T11:15:00" },
  { Student_ID: 65010003, Student_Name: "Thanakorn Srisuk", action: "Tokens redeemed", tokens: -15, weight: 0, created_at: "2026-03-31T11:30:00" },
  { Student_ID: 64010006, Student_Name: "Siriporn Kaewjai", action: "Bottle collected", tokens: 2, weight: 41, created_at: "2026-03-31T11:52:00" },
  { Student_ID: 65010004, Student_Name: "Warunee Khamphoo", action: "Bottle collected", tokens: 2, weight: 33, created_at: "2026-03-31T12:08:00" },
  { Student_ID: 64010007, Student_Name: "Anuwat Ponsri", action: "Bottle collected", tokens: 2, weight: 47, created_at: "2026-03-31T12:34:00" },
  { Student_ID: 65010005, Student_Name: "Kritsana Buakaew", action: "Tokens redeemed", tokens: -20, weight: 0, created_at: "2026-03-31T13:10:00" },
  { Student_ID: 64010008, Student_Name: "Kanokwan Sombut", action: "Bottle collected", tokens: 2, weight: 40, created_at: "2026-03-31T13:25:00" },
  { Student_ID: 65010006, Student_Name: "Naphat Rodsamran", action: "Bottle collected", tokens: 2, weight: 35, created_at: "2026-03-31T13:50:00" },
  { Student_ID: 64010009, Student_Name: "Teerawat Janta", action: "Bottle collected", tokens: 2, weight: 43, created_at: "2026-03-31T14:12:00" },
  { Student_ID: 65010007, Student_Name: "Monthon Saelee", action: "Bottle collected", tokens: 2, weight: 38, created_at: "2026-03-31T14:40:00" },
  { Student_ID: 64010010, Student_Name: "Rujira Phanomwan", action: "Tokens redeemed", tokens: -8, weight: 0, created_at: "2026-03-31T15:05:00" },
  { Student_ID: 65010008, Student_Name: "Patcharee Jaiboon", action: "Bottle collected", tokens: 2, weight: 36, created_at: "2026-03-31T15:22:00" },
  { Student_ID: 65010009, Student_Name: "Noppadon Srirak", action: "Bottle collected", tokens: 2, weight: 44, created_at: "2026-03-31T15:48:00" },
];

export default ActivityLogMockData;
