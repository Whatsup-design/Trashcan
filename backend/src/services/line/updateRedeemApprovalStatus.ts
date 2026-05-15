import { supabase } from "../../lib/supabase.js";

const REDEEM_TABLE = "Redeem";
const PENDING_STATUS = "PENDING";
const APPROVED_STATUS = "USED";

type RedeemStatusRow = {
  Redeem_ID: number;
  Redeem_Status: string | null;
};

export type RedeemApprovalResult =
  | {
      status: "NOT_FOUND";
    }
  | {
      status: "ALREADY_PROCESSED";
      currentStatus: string;
    }
  | {
      status: "APPROVED";
      requestId: string;
    };

export async function approveRedeemFromLine(
  requestId: string
): Promise<RedeemApprovalResult> {
  const redeemId = Number(requestId);

  if (!Number.isFinite(redeemId) || redeemId <= 0) {
    return { status: "NOT_FOUND" };
  }

  const { data: existingRedeem, error: readError } = await supabase
    .from(REDEEM_TABLE)
    .select("Redeem_ID, Redeem_Status")
    .eq("Redeem_ID", redeemId)
    .maybeSingle();

  if (readError) {
    throw new Error(`Failed to read redeem request: ${readError.message}`);
  }

  const existing = existingRedeem as RedeemStatusRow | null;

  if (!existing) {
    return { status: "NOT_FOUND" };
  }

  const currentStatus = existing.Redeem_Status ?? PENDING_STATUS;

  if (currentStatus !== PENDING_STATUS) {
    return {
      status: "ALREADY_PROCESSED",
      currentStatus,
    };
  }

  const { data: updatedRedeem, error: updateError } = await supabase
    .from(REDEEM_TABLE)
    .update({ Redeem_Status: APPROVED_STATUS })
    .eq("Redeem_ID", redeemId)
    .eq("Redeem_Status", PENDING_STATUS)
    .select("Redeem_ID")
    .maybeSingle();

  if (updateError) {
    throw new Error(`Failed to approve redeem request: ${updateError.message}`);
  }

  if (!updatedRedeem) {
    return {
      status: "ALREADY_PROCESSED",
      currentStatus,
    };
  }

  return {
    status: "APPROVED",
    requestId,
  };
}
