import type { webhook } from "@line/bot-sdk";
import { lineClient } from "../../lib/line.js";
import { handleRedeemApprovalFromLine } from "../redeem/handleRedeemApprovalFromLine.js";

async function replyText(replyToken: string | undefined, text: string) {
  if (!replyToken) {
    console.log("[LINE] missing replyToken. Message:", text);
    return;
  }

  await lineClient.replyMessage({
    replyToken,
    messages: [
      {
        type: "text",
        text,
      },
    ],
  });
}

function getPostbackParams(data: string) {
  const params = new URLSearchParams(data);

  return {
    action: params.get("action") ?? "",
    requestId: params.get("requestId") ?? "",
  };
}

function getLineSourceDebugInfo(event: webhook.PostbackEvent) {
  const source = event.source;

  return {
    userId: source?.userId,
    groupId: source && source.type === "group" ? source.groupId : undefined,
  };
}

function mapDecision(action: string) {
  if (action === "approve_redeem") {
    return "approve" as const;
  }

  if (action === "cancel_redeem") {
    return "cancel" as const;
  }

  return null;
}

export async function handleLinePostback(event: webhook.PostbackEvent) {
  const { action, requestId } = getPostbackParams(event.postback.data);
  const { userId, groupId } = getLineSourceDebugInfo(event);

  console.log(
    `[LINE] postback action=${action} requestId=${requestId}`,
    { userId, groupId }
  );

  const decision = mapDecision(action);

  if (!decision) {
    await replyText(event.replyToken, `Unknown LINE action: ${action}`);
    return;
  }

  if (!requestId) {
    await replyText(event.replyToken, "Missing redeem request id.");
    return;
  }

  const approvalInput = {
    requestId,
    decision,
    ...(userId ? { lineUserId: userId } : {}),
  };
  const result = await handleRedeemApprovalFromLine(approvalInput);

  await replyText(event.replyToken, result.message);
}
