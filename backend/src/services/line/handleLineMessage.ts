import type { webhook } from "@line/bot-sdk";
import { lineClient } from "../../lib/line.js";
import { buildRecentRedeemReportFlex } from "./buildRecentRedeemReportFlex.js";
import { getRecentUsedRedeemReport } from "./getRecentUsedRedeemReport.js";

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

async function replyRecentRedeemReport(replyToken: string | undefined) {
  if (!replyToken) {
    console.log("[LINE] missing replyToken for recent redeem report");
    return;
  }

  const reportItems = await getRecentUsedRedeemReport();
  const reportMessage = buildRecentRedeemReportFlex(reportItems);

  await lineClient.replyMessage({
    replyToken,
    messages: [reportMessage],
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

  await replyRecentRedeemReport(event.replyToken);
}
