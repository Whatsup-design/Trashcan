import { supabase } from "../../lib/supabase.js";

export async function getDashboardData() {
  const { data: DashboardData, error: DashboardError } = await supabase
    .from("User")
    .select("Student_Bottles, Student_Tokens, Student_weight");
    

  if (DashboardError) {
    console.error("Error fetching dashboard data:", DashboardError);
    throw new Error("Failed to fetch dashboard data");
  }

  const {data: FeedbackData, error: FeedbackError } = await supabase
    .from("Feedback")
    .select("ID, Student_ID, comment, time, Rating");

  if (FeedbackError) {
    console.error("Error fetching feedback data:", FeedbackError);
    throw new Error("Failed to fetch feedback data");
  }

  const avgRating = FeedbackData.length > 0
    ? FeedbackData.reduce((sum, feedback) => sum + feedback.Rating, 0) / FeedbackData.length
    : 0;

  const totalUsers=DashboardData.length;

  const totalBottles = DashboardData.reduce(
    (sum, user) => sum + (user.Student_Bottles ?? 0),
    0
  );

  const totalWeight = DashboardData.reduce(
    (sum, user) => sum + (user.Student_weight ?? 0),
    0
  );

  const totalTokens = DashboardData.reduce(
    (sum, user) => sum + (user.Student_Tokens ?? 0),
    0
  );

  return {
    dashboardData : {
      totalUsers,
      totalBottles,
      totalWeight,
      totalTokens
  }, feedbackData : FeedbackData, avgRating
    
  };
}
