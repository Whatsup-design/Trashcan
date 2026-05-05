import { supabase } from "../../lib/supabase.js";

type LeaderboardRow = {
  Student_ID: number;
  Student_FullNameE: string | null;
  Student_FullNameT: string | null;
  Student_Tokens: number | null;
  Student_Bottles: number | null;
  Student_weight: number | null;
  updated_at: string | null;
};

function getDisplayName(row: LeaderboardRow) {
  return (
    row.Student_FullNameE?.trim() ||
    row.Student_FullNameT?.trim() ||
    `Student ${row.Student_ID}`
  );
}

function mapLeaderboardEntry(row: LeaderboardRow, rank: number) {
  return {
    id: String(row.Student_ID),
    name: getDisplayName(row),
    tokens: row.Student_Tokens ?? 0,
    bottles: row.Student_Bottles ?? 0,
    avatar: null,
    rank,
  };
}

function compareLeaderboardRows(a: LeaderboardRow, b: LeaderboardRow) {
  const tokenDiff = (b.Student_Tokens ?? 0) - (a.Student_Tokens ?? 0);
  if (tokenDiff !== 0) return tokenDiff;

  const weightDiff = (b.Student_weight ?? 0) - (a.Student_weight ?? 0);
  if (weightDiff !== 0) return weightDiff;

  const bUpdatedAt = new Date(b.updated_at ?? 0).getTime();
  const aUpdatedAt = new Date(a.updated_at ?? 0).getTime();
  const recentDiff = bUpdatedAt - aUpdatedAt;
  if (recentDiff !== 0) return recentDiff;

  return a.Student_ID - b.Student_ID;
}

function getUniqueStudentRows(rows: LeaderboardRow[]) {
  const byStudentId = new Map<number, LeaderboardRow>();

  for (const row of rows) {
    const current = byStudentId.get(row.Student_ID);
    if (!current || compareLeaderboardRows(row, current) < 0) {
      byStudentId.set(row.Student_ID, row);
    }
  }

  return Array.from(byStudentId.values());
}

export async function getUserLeaderboardData(studentId: number) {
  const { data: rows, error: rowsError } = await supabase
    .from("User")
    .select(
      "Student_ID, Student_FullNameE, Student_FullNameT, Student_Tokens, Student_Bottles, Student_weight, updated_at"
    )
    .eq("role", "student");

  if (rowsError) {
    console.error("Error fetching leaderboard rows:", rowsError);
    throw new Error("Failed to fetch leaderboard data");
  }

  const sortedRows = getUniqueStudentRows((rows as LeaderboardRow[] | null) ?? [])
    .sort(compareLeaderboardRows);
  const currentUserIndex = sortedRows.findIndex((row) => row.Student_ID === studentId);
  const currentUser = currentUserIndex >= 0 ? sortedRows[currentUserIndex] : null;

  if (!currentUser) {
    throw new Error("Leaderboard user not found");
  }

  const currentUserRank = currentUserIndex + 1;
  const topRows = sortedRows.slice(0, 10);

  return {
    month: new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
    topEntries: topRows.map((row, index) => mapLeaderboardEntry(row, index + 1)),
    currentUserEntry: mapLeaderboardEntry(currentUser, currentUserRank),
  };
}
