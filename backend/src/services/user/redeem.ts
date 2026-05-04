import { supabase } from "../../lib/supabase.js";

const REDEEM_TABLE = "Redeem";
export const REDEEM_STATUSES = ["PENDING", "USED", "CANCELLED", "EXPIRED"] as const;

export type RedeemStatus = (typeof REDEEM_STATUSES)[number];

type ProductRow = {
  Product_ID: number;
  Product_name: string | null;
  Product_Description: string | null;
  Product_Price: number | null;
  Product_limit: number | null;
  Product_Img: string | null;
  Product_ImgUrl: string | null;
};

type RedeemRow = {
  Reedeem_ID: number;
  Reedem_Date: string;
  Student_ID: number;
  Product_ID: number;
  Product_Img?: string | null;
  Product_ImgUrl?: string | null;
  Redeem_Status?: string | null;
};

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function countActiveMonthlyRedeems(
  studentId: number,
  productId: number
) {
  const { start, end } = getCurrentMonthRange();
  const { count, error } = await supabase
    .from(REDEEM_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("Student_ID", studentId)
    .eq("Product_ID", productId)
    .in("Redeem_Status", ["PENDING", "USED"])
    .gte("Reedem_Date", start)
    .lt("Reedem_Date", end);

  if (error) {
    throw new Error(`Failed to count monthly redeems: ${error.message}`);
  }

  return count ?? 0;
}

export function buildRedeemAvailability(productLimit: number, redeemedThisMonth: number) {
  const safeLimit = Math.max(productLimit, 0);
  const remainingThisMonth = Math.max(safeLimit - redeemedThisMonth, 0);

  return {
    redeemedThisMonth,
    remainingThisMonth,
    canRedeem: remainingThisMonth > 0,
  };
}

export async function getUserRedeem(studentId: number) {
  const { data: redeemRows, error } = await supabase
    .from(REDEEM_TABLE)
    .select("*")
    .eq("Student_ID", studentId)
    .order("Reedem_Date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch redeem data: ${error.message}`);
  }

  const redeems = (redeemRows as RedeemRow[] | null) ?? [];

  if (redeems.length === 0) {
    return [];
  }

  const productIds = Array.from(
    new Set(redeems.map((redeem) => redeem.Product_ID))
  );

  const { data: productRows, error: productError } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_limit, Product_Img, Product_ImgUrl"
    )
    .in("Product_ID", productIds);

  if (productError) {
    throw new Error(`Failed to fetch redeem products: ${productError.message}`);
  }

  const productMap = new Map(
    ((productRows as ProductRow[] | null) ?? []).map((product) => [
      product.Product_ID,
      product,
    ])
  );

  return redeems.map((redeem) => {
    const product = productMap.get(redeem.Product_ID);

    return {
      Reedeem_ID: redeem.Reedeem_ID,
      Reedem_Date: redeem.Reedem_Date,
      Student_ID: redeem.Student_ID,
      Product_ID: redeem.Product_ID,
      Product_name: product?.Product_name ?? "Unknown reward",
      Product_Description: product?.Product_Description ?? "",
      Product_Price: product?.Product_Price ?? 0,
      Product_Img: redeem.Product_Img ?? product?.Product_Img ?? null,
      Product_ImgUrl: redeem.Product_ImgUrl ?? product?.Product_ImgUrl ?? null,
      Redeem_Status: redeem.Redeem_Status ?? "PENDING",
    };
  });
}

export async function putUserRedeem(studentId: number, productId: number) {
  const { data: product, error: productError } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_Img, Product_ImgUrl"
    )
    .eq("Product_ID", productId)
    .maybeSingle();

  if (productError) {
    throw new Error(`Failed to fetch product: ${productError.message}`);
  }

  const productRow = product as ProductRow | null;

  if (!productRow) {
    throw new Error("Product not found");
  }

  const redeemedThisMonth = await countActiveMonthlyRedeems(
    studentId,
    productRow.Product_ID
  );
  const availability = buildRedeemAvailability(
    productRow.Product_limit ?? 0,
    redeemedThisMonth
  );

  if (!availability.canRedeem) {
    throw new Error("Redeem limit reached");
  }

  const payload = {
    Reedem_Date: new Date().toISOString(),
    Student_ID: studentId,
    Product_ID: productRow.Product_ID,
    Product_Img: productRow.Product_Img,
    Product_ImgUrl: productRow.Product_ImgUrl,
    Redeem_Status: "PENDING",
  };

  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create redeem: ${error.message}`);
  }

  return {
    ...data,
    product: {
      id: productRow.Product_ID,
      name: productRow.Product_name,
      description: productRow.Product_Description,
      price: productRow.Product_Price,
      image: productRow.Product_Img,
      imageUrl: productRow.Product_ImgUrl,
    },
  };
}


export async function deleteUserRedeem(studentId: number, redeemId: number) {
  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .delete()
    .eq("Reedeem_ID", redeemId)
    .eq("Student_ID", studentId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete redeem: ${error.message}`);
  }

  if (!data) {
    throw new Error("Redeem not found");
  }

  return data;
}

export async function patchUserRedeemStatus(
  studentId: number,
  redeemId: number,
  status: RedeemStatus
) {
  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .update({ Redeem_Status: status })
    .eq("Reedeem_ID", redeemId)
    .eq("Student_ID", studentId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update redeem status: ${error.message}`);
  }

  if (!data) {
    throw new Error("Redeem not found");
  }

  return data;
}
