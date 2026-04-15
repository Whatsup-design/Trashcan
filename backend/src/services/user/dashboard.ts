import {supabase} from '../../lib/supabase.js';

export async function getUserDashboardData() {
    const { data: DashboardData, error: DashboardError } = await supabase
        .from("User")
        .select("Student_Bottles, Student_Tokens, Student_weight");

    if (DashboardError) {
        console.error("Error fetching dashboard data:", DashboardError);
        throw new Error("Failed to fetch dashboard data");
    }

    return DashboardData;

}