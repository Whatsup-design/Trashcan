import {supabase} from "../../lib/supabase.js";

export async function UserMarketData(_studentId: number) {
  const { data, error } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_Status, Product_limit, Product_ImgUrl, Product_StartDate, Product_EndDate"
    )
    .order("Product_ID", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }

  return data ?? [];
}
