import type { messagingApi } from "@line/bot-sdk";
import {
  formatRedeemReportDate,
  type RecentUsedRedeemReportItem,
} from "./getRecentUsedRedeemReport.js";

function text(value: string, options: Record<string, unknown> = {}) {
  return {
    type: "text",
    text: value,
    ...options,
  };
}

function buildRedeemRow(item: RecentUsedRedeemReportItem) {
  return {
    type: "box",
    layout: "vertical",
    spacing: "xs",
    paddingAll: "12px",
    backgroundColor: "#F8FAFC",
    cornerRadius: "12px",
    contents: [
      {
        type: "box",
        layout: "horizontal",
        contents: [
          text(item.studentName, {
            weight: "bold",
            size: "sm",
            color: "#0F172A",
            flex: 5,
            wrap: true,
          }),
          text(`${item.tokenPrice} tokens`, {
            weight: "bold",
            size: "sm",
            color: "#2563EB",
            align: "end",
            flex: 3,
          }),
        ],
      },
      text(item.productName, {
        size: "xs",
        color: "#475569",
        wrap: true,
      }),
      {
        type: "box",
        layout: "horizontal",
        contents: [
          text(`Student ID: ${item.studentId ?? "-"}`, {
            size: "xxs",
            color: "#64748B",
            flex: 5,
          }),
          text(formatRedeemReportDate(item.redeemDate), {
            size: "xxs",
            color: "#64748B",
            align: "end",
            flex: 3,
          }),
        ],
      },
    ],
  };
}

export function buildRecentRedeemReportFlex(
  items: RecentUsedRedeemReportItem[]
): messagingApi.FlexMessage {
  const contents =
    items.length > 0
      ? items.map(buildRedeemRow)
      : [
          text("No used redeem records found in the last 14 days.", {
            size: "sm",
            color: "#64748B",
            wrap: true,
          }),
        ];

  return {
    type: "flex",
    altText: "Recent used redeem report",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          text("All Redeems", {
            weight: "bold",
            size: "xl",
            color: "#0F172A",
          }),
          text("Used rewards in the last 14 days", {
            size: "sm",
            color: "#2563EB",
            weight: "bold",
          }),
          {
            type: "separator",
            margin: "md",
          },
          ...contents,
        ],
      },
    },
  } as messagingApi.FlexMessage;
}
