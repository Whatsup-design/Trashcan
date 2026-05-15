import { supabase } from "../../lib/supabase.js";
import { createNotification } from "../shared/notification.js";
import { sendRedeemApprovalCard } from "../line/sendRedeemApprovalCard.js";

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
  Redeem_ID: number;
  Redeem_Date: string;
  Student_ID: number;
  Product_ID: number;
  Product_Img?: string | null;
  Product_ImgUrl?: string | null;
  Redeem_Status?: string | null;
};

type RedeemUserRow = {
  Student_ID: number;
  Student_Tokens: number | null;
  updated_at: string | null;
};

type RedeemApprovalUserRow = {
  Student_ID: number;
  Student_FullNameE: string | null;
  Student_NickNameE: string | null;
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

async function createRedeemNotificationSafe(params: {
  studentId: number;
  type: "TOKEN_EXCHANGED" | "REDEEM_USED" | "REDEEM_EXPIRED";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await createNotification({
      studentId: params.studentId,
      type: params.type,
      title: params.title,
      message: params.message,
      metadata: params.metadata ?? null,
    });
  } catch (error) {
    console.error("Failed to create redeem notification:", error);
  }
}

function getRedeemApprovalDisplayName(user: RedeemApprovalUserRow) {
  return (
    user.Student_FullNameE?.trim() ||
    user.Student_NickNameE?.trim() ||
    `Student ${user.Student_ID}`
  );
}

async function getRedeemApprovalUser(studentId: number) {
  const { data, error } = await supabase
    .from("User")
    .select("Student_ID, Student_FullNameE, Student_NickNameE")
    .eq("Student_ID", studentId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch redeem user data: ${error.message}`);
  }

  const user = data as RedeemApprovalUserRow | null;

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function sendRedeemApprovalCardSafe(params: {
  requestId: string;
  studentId: number;
  studentName: string;
  productName: string;
  price: number;
  imageUrl?: string | null;
}) {
  try {
    await sendRedeemApprovalCard({
      requestId: params.requestId,
      studentId: params.studentId,
      name: params.studentName,
      productName: params.productName,
      price: params.price,
      ...(params.imageUrl !== undefined ? { imageUrl: params.imageUrl } : {}),
    });
  } catch (error) {
    console.error("[LINE] failed to send redeem approval card:", error);
  }
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
    .gte("Redeem_Date", start)
    .lt("Redeem_Date", end);

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

async function subtractUserTokensWithRetry(params: {
  studentId: number;
  tokenCost: number;
  maxRetries?: number;
}) {
  const maxRetries = params.maxRetries ?? 3;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("Student_ID, Student_Tokens, updated_at")
      .eq("Student_ID", params.studentId)
      .maybeSingle();

    if (userError) {
      throw new Error(`Failed to fetch user token balance: ${userError.message}`);
    }

    const user = userData as RedeemUserRow | null;

    if (!user) {
      throw new Error("User not found");
    }

    const currentTokens = user.Student_Tokens ?? 0;

    if (currentTokens < params.tokenCost) {
      throw new Error("Not enough tokens");
    }

    const nextTokens = currentTokens - params.tokenCost;
    let updateQuery = supabase
      .from("User")
      .update({ Student_Tokens: nextTokens })
      .eq("Student_ID", params.studentId);

    if (user.updated_at) {
      updateQuery = updateQuery.eq("updated_at", user.updated_at);
    }

    const { data: updatedUser, error: updateError } = await updateQuery
      .select("Student_Tokens")
      .maybeSingle();

    if (updateError) {
      throw new Error(`Failed to update user token balance: ${updateError.message}`);
    }

    if (updatedUser) {
      return {
        previousTokens: currentTokens,
        currentTokens: Number((updatedUser as Pick<RedeemUserRow, "Student_Tokens">).Student_Tokens ?? nextTokens),
      };
    }
  }

  throw new Error("RETRY_CONFLICT");
}

export async function getUserRedeem(studentId: number) {
  const { data: redeemRows, error } = await supabase
    .from(REDEEM_TABLE)
    .select("*")
    .eq("Student_ID", studentId)
    .order("Redeem_Date", { ascending: false });

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
      Redeem_ID: redeem.Redeem_ID,
      Redeem_Date: redeem.Redeem_Date,
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
  const approvalUser = await getRedeemApprovalUser(studentId);
  const { data: product, error: productError } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_limit, Product_Img, Product_ImgUrl"
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

  const tokenCost = productRow.Product_Price ?? 0;
  const tokenUpdate = await subtractUserTokensWithRetry({
    studentId,
    tokenCost,
  });

  const payload = {
    Redeem_Date: new Date().toISOString(),
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

  await createRedeemNotificationSafe({
    studentId,
    type: "TOKEN_EXCHANGED",
    title: "Reward redeemed",
    message: `${productRow.Product_name ?? "Your reward"} has been added to your redeem cart.`,
    metadata: {
      productId: productRow.Product_ID,
      redeemId: (data as RedeemRow).Redeem_ID,
      productName: productRow.Product_name,
      tokenCost: productRow.Product_Price,
    },
  });

  await sendRedeemApprovalCardSafe({
    requestId: String((data as RedeemRow).Redeem_ID),
    studentId,
    studentName: getRedeemApprovalDisplayName(approvalUser),
    productName: productRow.Product_name ?? "Unknown reward",
    price: productRow.Product_Price ?? 0,
    imageUrl: productRow.Product_ImgUrl,
  });

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
    currentTokens: tokenUpdate.currentTokens,
    previousTokens: tokenUpdate.previousTokens,
    tokensSpent: tokenCost,
  };
}


export async function deleteUserRedeem(studentId: number, redeemId: number) {
  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .delete()
    .eq("Redeem_ID", redeemId)
    .eq("Student_ID", studentId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete redeem: ${error.message}`);
  }

  if (!data) {
    throw new Error("Redeem not found");
  }

  if (status === "USED" || status === "EXPIRED") {
    await createRedeemNotificationSafe({
      studentId,
      type: status === "USED" ? "REDEEM_USED" : "REDEEM_EXPIRED",
      title: status === "USED" ? "Reward used" : "Reward expired",
      message:
        status === "USED"
          ? "Your redeemed reward has been marked as used."
          : "Your redeemed reward has expired.",
      metadata: {
        redeemId,
        status,
        productId: (data as RedeemRow).Product_ID,
      },
    });
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
    .eq("Redeem_ID", redeemId)
    .eq("Student_ID", studentId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update redeem status: ${error.message}`);
  }

  if (!data) {
    throw new Error("Redeem not found");
  }

  if (status === "USED" || status === "EXPIRED") {
    await createRedeemNotificationSafe({
      studentId,
      type: status === "USED" ? "REDEEM_USED" : "REDEEM_EXPIRED",
      title: status === "USED" ? "Reward used" : "Reward expired",
      message:
        status === "USED"
          ? "Your redeemed reward has been marked as used."
          : "Your redeemed reward has expired.",
      metadata: {
        redeemId,
        status,
        productId: (data as RedeemRow).Product_ID,
      },
    });
  }

  return data;
}
