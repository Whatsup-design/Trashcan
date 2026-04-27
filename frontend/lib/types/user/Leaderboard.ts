export type LeaderboardEntry = {
  id: string;
  name: string;
  tokens: number;
  bottles: number;
  avatar?: string | null;
  rank: number;
};

export type LeaderboardResponse = {
  month: string;
  topEntries: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry;
};
