import { supabase } from "../../lib/supabase.js";
import {
  buildRedeemAvailability,
  countActiveMonthlyRedeems,
} from "./redeem.js";

type UserMarketProductRow = {
  Product_ID: number;
  Product_name: string;
  Product_Description: string | null;
  Product_Price: number;
  Product_Status: string;
  Product_limit: number;
  Product_ImgUrl: string | null;
  Product_StartDate: string | null;
  Product_EndDate: string | null;
};

async function addRedeemAvailability(
  studentId: number,
  product: UserMarketProductRow
) {
  const redeemedThisMonth = await countActiveMonthlyRedeems(
    studentId,
    product.Product_ID
  );
  const availability = buildRedeemAvailability(
    product.Product_limit,
    redeemedThisMonth
  );

  return {
    ...product,
    ...availability,
  };
}

export async function UserMarketData(studentId: number) {
  const { data, error } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_Status, Product_limit, Product_ImgUrl, Product_StartDate, Product_EndDate"
    )
    .order("Product_ID", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }

  const products = (data as UserMarketProductRow[] | null) ?? [];

  return Promise.all(
    products.map((product) => addRedeemAvailability(studentId, product))
  );
}
