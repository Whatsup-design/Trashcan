export type UserDashboardData = {
  bottlesThrown: number;
  weightGram: number;
  tokensBalance: number;
  currentRank: number;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "warning" | "success";
};

const mockUserData: UserDashboardData = {
  bottlesThrown: 142,
  weightGram: 5840,
  tokensBalance: 284,
  currentRank: 3,
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New reward available!",
    message: "Free coffee coupon is now available in Token & Market.",
    date: "Mar 22, 2025",
    type: "success",
  },
  {
    id: "2",
    title: "Maintenance notice",
    message: "Device B-03 will be offline for maintenance on Mar 25.",
    date: "Mar 21, 2025",
    type: "warning",
  },
  {
    id: "3",
    title: "Token bonus week",
    message: "Earn double tokens every bottle thrown this week!",
    date: "Mar 20, 2025",
    type: "info",
  },
];

export default { mockUserData, mockAnnouncements };
