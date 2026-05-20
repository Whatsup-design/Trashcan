import type { webhook } from "@line/bot-sdk";
import { lineClient } from "../../lib/line.js";
import { getRecentUsedRedeemReport } from "./getRecentUsedRedeemReport.js";
import { checkLineCommandRateLimit } from "./lineCommandRateLimit.js";

function isAllRedeemCommand(text: string) {
  return text.toLowerCase().includes("allre");
}

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

export async function handleLineMessage(event: webhook.MessageEvent) {
  if (event.message.type !== "text") {
    return;
  }

  const text = event.message.text.trim();

  if (!isAllRedeemCommand(text)) {
    return;
  }

  const rateLimit = checkLineCommandRateLimit(event);

  if (!rateLimit.allowed) {
    await replyText(
      event.replyToken,
      `Please wait ${rateLimit.retryAfterSeconds} seconds before requesting AllRe again.`
    );
    return;
  }

  const report = await getRecentUsedRedeemReport();
  await replyText(event.replyToken, report);
}
