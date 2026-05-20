import { supabase } from "../../lib/supabase.js";

const REDEEM_TABLE = "Redeem";

type CartRedeemRow = {
  Redeem_ID: number;
  Redeem_Date: string;
  Student_ID: number;
  Product_ID: number;
  Product_Img?: string | null;
  Product_ImgUrl?: string | null;
  Redeem_Status?: string | null;
};

type CartProductRow = {
  Product_ID: number;
  Product_name: string | null;
  Product_Description: string | null;
  Product_Price: number | null;
  Product_ImgUrl: string | null;
};

function mapCartRows(
  redeems: CartRedeemRow[],
  productMap: Map<number, CartProductRow> = new Map()
) {
  return redeems.map((redeem) => {
    const product = productMap.get(redeem.Product_ID);

    return {
      Redeem_ID: redeem.Redeem_ID,
      Redeem_Date: redeem.Redeem_Date,
      Student_ID: redeem.Student_ID,
      Product_ID: redeem.Product_ID,
      Product_name: product?.Product_name ?? "Unknown reward",
      Product_Description: product?.Product_Description ?? "",
      Product_Price: product?.Product_Price ?? 0,
      Product_Img: redeem.Product_Img ?? null,
      Product_ImgUrl: redeem.Product_ImgUrl ?? product?.Product_ImgUrl ?? null,
      Redeem_Status: redeem.Redeem_Status ?? "USED",
    };
  });
}

export async function getUserCart(studentId: number) {
  const { data: redeemRows, error } = await supabase
    .from(REDEEM_TABLE)
    .select("*")
    .eq("Student_ID", studentId)
    .order("Redeem_Date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cart data: ${error.message}`);
  }

  const redeems = (redeemRows as CartRedeemRow[] | null) ?? [];

  if (redeems.length === 0) {
    return [];
  }

  const productIds = Array.from(
    new Set(
      redeems
        .map((redeem) => redeem.Product_ID)
        .filter((productId) => Number.isFinite(productId) && productId > 0)
    )
  );

  if (productIds.length === 0) {
    return mapCartRows(redeems);
  }

  const { data: productRows, error: productError } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_ImgUrl"
    )
    .in("Product_ID", productIds);

  if (productError) {
    console.error("Failed to fetch cart products:", productError);
    return mapCartRows(redeems);
  }

  const productMap = new Map(
    ((productRows as CartProductRow[] | null) ?? []).map((product) => [
      product.Product_ID,
      product,
    ])
  );

  return mapCartRows(redeems, productMap);
}
