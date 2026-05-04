import { supabase } from "../../lib/supabase.js";

type LeaderboardRow = {
  Student_ID: number;
  Student_FullNameE: string | null;
  Student_FullNameT: string | null;
  Student_Tokens: number | null;
  Student_Bottles: number | null;
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

function getRankByTokens(rows: LeaderboardRow[], tokens: number) {
  return rows.filter((row) => (row.Student_Tokens ?? 0) > tokens).length + 1;
}

export async function getUserLeaderboardData(studentId: number) {
  const { data: topRows, error: topRowsError } = await supabase
    .from("User")
    .select(
      "Student_ID, Student_FullNameE, Student_FullNameT, Student_Tokens, Student_Bottles"
    )
    .eq("role", "student")
    .order("Student_Tokens", { ascending: false })
    .limit(10);

  if (topRowsError) {
    console.error("Error fetching top leaderboard rows:", topRowsError);
    throw new Error("Failed to fetch leaderboard data");
  }

  const { data: currentUserRow, error: currentUserError } = await supabase
    .from("User")
    .select(
      "Student_ID, Student_FullNameE, Student_FullNameT, Student_Tokens, Student_Bottles"
    )
    .eq("Student_ID", studentId)
    .eq("role", "student")
    .maybeSingle();

  if (currentUserError) {
    console.error("Error fetching current leaderboard user:", currentUserError);
    throw new Error("Failed to fetch leaderboard data");
  }

  const currentUser = currentUserRow as LeaderboardRow | null;

  if (!currentUser) {
    throw new Error("Leaderboard user not found");
  }

  const currentUserTokens = currentUser.Student_Tokens ?? 0;

  const { count: usersAboveCount, error: rankError } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")
    .gt("Student_Tokens", currentUserTokens);

  if (rankError) {
    console.error("Error calculating leaderboard rank:", rankError);
    throw new Error("Failed to fetch leaderboard data");
  }

  const currentUserRank = (usersAboveCount ?? 0) + 1;
  const normalizedTopRows = (topRows as LeaderboardRow[] | null) ?? [];

  return {
    month: new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
    topEntries: normalizedTopRows.map((row) =>
      mapLeaderboardEntry(
        row,
        getRankByTokens(normalizedTopRows, row.Student_Tokens ?? 0)
      )
    ),
    currentUserEntry: mapLeaderboardEntry(currentUser, currentUserRank),
  };
}
