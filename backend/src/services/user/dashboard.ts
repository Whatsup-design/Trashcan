import { supabase } from "../../lib/supabase.js";

type UserDashboardRow = {
  Student_ID: number;
  Student_Bottles: number | null;
  Student_Tokens: number | null;
  Student_weight: number | null;
};

export async function getUserDashboardData(studentId: number) {
  const { data: userRow, error: userError } = await supabase
    .from("User")
    .select("Student_ID, Student_Bottles, Student_Tokens, Student_weight")
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

  const { count: usersAboveCount, error: usersAboveError } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")
    .gt("Student_Tokens", currentTokens);

  if (usersAboveError) {
    console.error("Error counting current rank:", usersAboveError);
    throw new Error("Failed to fetch dashboard data");
  }

  const currentRank = (usersAboveCount ?? 0) + 1;

  return {
    studentId: currentUser.Student_ID,
    bottlesThrown: currentBottles,
    weightGram: currentUser.Student_weight ?? 0,
    tokensBalance: currentTokens,
    currentRank,
  };
}
