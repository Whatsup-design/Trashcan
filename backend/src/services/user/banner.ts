import { supabase } from "../../lib/supabase.js";

export async function getUserBannerData() {
  const { data, error } = await supabase
    .from("Banner")
    .select("Banner_ID, Banner_Img, Banner_ImgUrl, Banner_IsActive, created_at, updated_at")
    .eq("Banner_IsActive", true)
    .order("Banner_ID", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch banner data: ${error.message}`);
  }

  return data ?? [];
}
