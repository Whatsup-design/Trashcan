type HandleRedeemApprovalFromLineParams = {
  requestId: string;
  decision: "approve" | "cancel";
  lineUserId?: string;
};

type RedeemApprovalFromLineResult = {
  message: string;
};

export async function handleRedeemApprovalFromLine(
  params: HandleRedeemApprovalFromLineParams
): Promise<RedeemApprovalFromLineResult> {
  if (params.decision === "approve") {
    return {
      message: `Approved redeem request ${params.requestId}.`,
    };
  }

  return {
    message: `Cancelled redeem request ${params.requestId}.`,
  };
}
