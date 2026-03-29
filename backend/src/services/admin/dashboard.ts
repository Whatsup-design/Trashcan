import { supabase } from "../../lib/supbase.js";


export async function getDashboardData() {
  const { count: totalUsers, error: userError } = await supabase
    .from('User')
    .select('*', { count: 'exact', head: true });

  if (userError) {
    console.error('Error fetching total users:', userError);
    throw new Error('Failed to fetch total users');
  }

  return {
    totalUsers,
  };
}
