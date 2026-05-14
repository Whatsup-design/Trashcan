import { lineClient } from "../../lib/line.js";
import { buildRedeemApprovalCard } from "./buildRedeemApprovalCard.js";

type SendRedeemApprovalCardParams = {
  requestId: string;
  studentId: string | number;
  name: string;
  productName: string;
  price: number;
  imageUrl?: string | null;
};

function getApprovalGroupId() {
  const groupId = process.env.LINE_APPROVAL_GROUP_ID?.trim();

  if (!groupId) {
    throw new Error("Missing required LINE environment variable: LINE_APPROVAL_GROUP_ID");
  }

  return groupId;
}

export async function sendRedeemApprovalCard(
  params: SendRedeemApprovalCardParams
): Promise<void> {
  const approvalGroupId = getApprovalGroupId();
  const message = buildRedeemApprovalCard(params);

  await lineClient.pushMessage({
    to: approvalGroupId,
    messages: [message],
  });
}
