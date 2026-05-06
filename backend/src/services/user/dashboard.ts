import { supabase } from "../../lib/supabase.js";

type UserDashboardRow = {
  Student_ID: number;
  Student_NickNameE: string | null;
  Student_Bottles: number | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
  updated_at: string | null;
};

function compareDashboardRankRows(a: UserDashboardRow, b: UserDashboardRow) {
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

export async function getUserDashboardData(studentId: number) {
  const { data: userRow, error: userError } = await supabase
    .from("User")
    .select("Student_ID, Student_NickNameE, Student_Bottles, Student_Tokens, Student_weight, updated_at")
    .eq("Student_ID", studentId)
    .eq("role", "student")
    .maybeSingle();

  if (userError) {
    console.error("Error fetching user dashboard data:", userError);
    throw new Error("Failed to fetch dashboard data");
  }

  const currentUser = userRow as UserDashboardRow | null;

  if (!currentUser) {
    throw new Error("User dashboard data not found");
  }

  const currentBottles = currentUser.Student_Bottles ?? 0;
  const currentTokens = currentUser.Student_Tokens ?? 0;

  const { data: rankRows, error: rankRowsError } = await supabase
    .from("User")
    .select("Student_ID, Student_Bottles, Student_Tokens, Student_weight, updated_at")
    .eq("role", "student");

  if (rankRowsError) {
    console.error("Error counting current rank:", rankRowsError);
    throw new Error("Failed to fetch dashboard data");
  }

  const sortedRows = ((rankRows as UserDashboardRow[] | null) ?? [])
    .sort(compareDashboardRankRows);
  const currentRank =
    sortedRows.findIndex((row) => row.Student_ID === studentId) + 1;

  return {
    studentId: currentUser.Student_ID,
    studentNicknameE: currentUser.Student_NickNameE ?? "",
    bottlesThrown: currentBottles,
    weightGram: currentUser.Student_weight ?? 0,
    tokensBalance: currentTokens,
    currentRank,
  };
}
