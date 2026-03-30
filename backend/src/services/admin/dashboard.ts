import { supabase } from "../../lib/supbase.js";

export async function getDashboardData() {
  const { data, error } = await supabase
    .from("User")
    .select("Student_Bottles, Student_Tokens, Student_weight");

  if (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }

  const totalUsers = data.length;

  const totalBottles = data.reduce(
    (sum, user) => sum + (user.Student_Bottles ?? 0),
    0
  );

  const totalWeight = data.reduce(
    (sum, user) => sum + (user.Student_weight ?? 0),
    0
  );

  const totalTokens = data.reduce(
    (sum, user) => sum + (user.Student_Tokens ?? 0),
    0
  );

  return {
    totalUsers,
    totalBottles,
    totalWeight,
    totalTokens,
  };
}
