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
  Product_Limited: boolean;
  Product_limit: number;
  Product_ImgUrl: string | null;
  Product_StartDate: string | null;
  Product_EndDate: string | null;
};

type UserMarketProfileRow = {
  Student_Tokens: number | null;
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
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("Student_Tokens")
    .eq("Student_ID", studentId)
    .maybeSingle();

  if (userError) {
    throw new Error(`Failed to fetch user token data: ${userError.message}`);
  }

  const user = userData as UserMarketProfileRow | null;

  if (!user) {
    throw new Error("User market profile not found");
  }

  const { data, error } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_Limited, Product_limit, Product_ImgUrl, Product_StartDate, Product_EndDate"
    )
    .order("Product_ID", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }

  const products = (data as UserMarketProductRow[] | null) ?? [];
  const productsWithAvailability = await Promise.all(
    products.map((product) => addRedeemAvailability(studentId, product))
  );

  return {
    tokens: user.Student_Tokens ?? 0,
    products: productsWithAvailability,
  };
}
