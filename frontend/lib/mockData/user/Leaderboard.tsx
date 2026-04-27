export type LeaderboardEntry = {
  id: string;
  name: string;
  tokens: number;
  bottles: number;
  avatar?: string;
};

export type LeaderboardData = {
  month: string;
  currentUserId: string;
  entries: LeaderboardEntry[];
};

export const leaderboardData: LeaderboardData = {
  month: "March 2025",
  currentUserId: "8",
  entries: [
    { id: "1", name: "Somchai Jaidee", tokens: 190, bottles: 95 },
    { id: "2", name: "Malee Srisuwan", tokens: 90, bottles: 45 },
    { id: "3", name: "Nattapong Khamdi", tokens: 16, bottles: 8 },
    { id: "4", name: "Pornpan Rodpai", tokens: 182, bottles: 91 },
    { id: "5", name: "Wichai Thongdee", tokens: 66, bottles: 33 },
    { id: "6", name: "Siriporn Kaewjai", tokens: 10, bottles: 5 },
    { id: "7", name: "Anuwat Ponsri", tokens: 120, bottles: 60 },
    { id: "8", name: "Kanokwan Sombut", tokens: 44, bottles: 22 },
    { id: "9", name: "Teerawat Janta", tokens: 176, bottles: 88 },
    { id: "10", name: "Rujira Phanomwan", tokens: 28, bottles: 14 },
    { id: "11", name: "Piyaphat Charoen", tokens: 110, bottles: 55 },
    { id: "12", name: "Supansa Wongpan", tokens: 6, bottles: 3 },
    { id: "13", name: "Thanakorn Srisuk", tokens: 154, bottles: 77 },
    { id: "14", name: "Warunee Khamphoo", tokens: 82, bottles: 41 },
    { id: "15", name: "Kritsana Buakaew", tokens: 38, bottles: 19 },
  ],
};
