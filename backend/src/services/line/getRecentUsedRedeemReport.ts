import { supabase } from "../../lib/supabase.js";

const REDEEM_TABLE = "Redeem";
const USED_STATUS = "USED";
const REPORT_DAYS = 14;
const REPORT_LIMIT = 25;

type RedeemReportRow = {
  Redeem_ID: number;
  Redeem_Date: string;
  Student_ID: number | null;
  Product_ID: number | null;
};

type UserRow = {
  Student_ID: number;
  Student_FullNameE: string | null;
  Student_NickNameE: string | null;
};

type ProductRow = {
  Product_ID: number;
  Product_name: string | null;
  Product_Price: number | null;
};

export type RecentUsedRedeemReportItem = {
  redeemId: number;
  redeemDate: string;
  studentId: number | null;
  studentName: string;
  productId: number | null;
  productName: string;
  tokenPrice: number;
};

function getReportStartDate() {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - REPORT_DAYS);
  return start.toISOString();
}

function formatName(user: UserRow | undefined, studentId: number) {
  return (
    user?.Student_NickNameE?.trim() ||
    user?.Student_FullNameE?.trim() ||
    `Student ${studentId}`
  );
}

export function formatRedeemReportDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}

function isValidId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function getRecentUsedRedeemReport(): Promise<
  RecentUsedRedeemReportItem[]
> {
  const { data: redeemRows, error } = await supabase
    .from(REDEEM_TABLE)
    .select("Redeem_ID, Redeem_Date, Student_ID, Product_ID")
    .eq("Redeem_Status", USED_STATUS)
    .gte("Redeem_Date", getReportStartDate())
    .order("Redeem_Date", { ascending: false })
    .limit(REPORT_LIMIT);

  if (error) {
    throw new Error(`Failed to fetch LINE redeem report: ${error.message}`);
  }

  const redeems = (redeemRows as RedeemReportRow[] | null) ?? [];

  if (redeems.length === 0) {
    return [];
  }

  const studentIds = Array.from(
    new Set(redeems.map((row) => row.Student_ID).filter(isValidId))
  );
  const productIds = Array.from(
    new Set(redeems.map((row) => row.Product_ID).filter(isValidId))
  );

  const userQuery =
    studentIds.length > 0
      ? supabase
          .from("User")
          .select("Student_ID, Student_FullNameE, Student_NickNameE")
          .in("Student_ID", studentIds)
      : Promise.resolve({ data: [], error: null });
  const productQuery =
    productIds.length > 0
      ? supabase
          .from("Product")
          .select("Product_ID, Product_name, Product_Price")
          .in("Product_ID", productIds)
      : Promise.resolve({ data: [], error: null });

  const [{ data: userRows, error: userError }, { data: productRows, error: productError }] =
    await Promise.all([userQuery, productQuery]);

  if (userError) {
    throw new Error(`Failed to fetch LINE redeem users: ${userError.message}`);
  }

  if (productError) {
    throw new Error(`Failed to fetch LINE redeem products: ${productError.message}`);
  }

  const userMap = new Map(
    ((userRows as UserRow[] | null) ?? []).map((user) => [user.Student_ID, user])
  );
  const productMap = new Map(
    ((productRows as ProductRow[] | null) ?? []).map((product) => [
      product.Product_ID,
      product,
    ])
  );

  return redeems.map((redeem) => {
    const product = isValidId(redeem.Product_ID)
      ? productMap.get(redeem.Product_ID)
      : undefined;
    const name = isValidId(redeem.Student_ID)
      ? formatName(userMap.get(redeem.Student_ID), redeem.Student_ID)
      : "Unknown";
    const productName = product?.Product_name?.trim() || "Unknown reward";

    return {
      redeemId: redeem.Redeem_ID,
      redeemDate: redeem.Redeem_Date,
      studentId: redeem.Student_ID,
      studentName: name,
      productId: redeem.Product_ID,
      productName,
      tokenPrice: product?.Product_Price ?? 0,
    };
  });
}
