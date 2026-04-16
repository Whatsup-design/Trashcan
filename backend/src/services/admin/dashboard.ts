import { supabase } from "../../lib/supabase.js";
//okay / fixed later
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

  const feedbackRows = FeedbackData ?? [];
  const dashboardRows = DashboardData ?? [];

  const avgRating = feedbackRows.length > 0
    ? (() => {
        const sum = feedbackRows.reduce((s, f) => s + (Number(f.Rating) || 0), 0);
        return Number((sum / feedbackRows.length).toFixed(2));
      })()
    : 0;

  const totalUsers = dashboardRows.length;

  const totalBottles = dashboardRows.reduce((sum, user) => {
    return sum + (Number(user.Student_Bottles) || 0);
  }, 0);

  const totalWeight = dashboardRows.reduce((sum, user) => {
    return sum + (Number(user.Student_weight) || 0);
  }, 0);

  const totalTokens = dashboardRows.reduce((sum, user) => {
    return sum + (Number(user.Student_Tokens) || 0);
  }, 0);

  return {
    dashboardData : {
      totalUsers,
      totalBottles,
      totalWeight,
      totalTokens
  }, feedbackData : FeedbackData, avgRating
    
  };
}