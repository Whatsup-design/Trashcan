import type { webhook } from "@line/bot-sdk";
import { lineClient } from "../../lib/line.js";
import { approveRedeemFromLine } from "./updateRedeemApprovalStatus.js";

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

async function handleApprove(event: webhook.PostbackEvent, requestId: string) {
  const result = await approveRedeemFromLine(requestId);

  if (result.status === "NOT_FOUND") {
    await replyText(event.replyToken, "Redeem request not found.");
    return;
  }

  if (result.status === "ALREADY_PROCESSED") {
    await replyText(
      event.replyToken,
      `This request is already ${result.currentStatus}.`
    );
    return;
  }

  await replyText(event.replyToken, `Approved redeem request ${requestId}.`);
}

async function handleCancel(event: webhook.PostbackEvent, requestId: string) {
  console.log("[LINE] cancel requested for redeem:", requestId);
  await replyText(
    event.replyToken,
    "Cancel action is not enabled yet. No database changes were made."
  );
}

export async function handleLinePostback(event: webhook.PostbackEvent) {
  const { action, requestId } = getPostbackParams(event.postback.data);

  if (!requestId) {
    await replyText(event.replyToken, "Missing redeem request id.");
    return;
  }

  if (action === "approve_redeem") {
    await handleApprove(event, requestId);
    return;
  }

  if (action === "cancel_redeem") {
    await handleCancel(event, requestId);
    return;
  }

  await replyText(event.replyToken, "Unknown LINE approval action.");
}
