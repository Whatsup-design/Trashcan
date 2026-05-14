import type { messagingApi } from "@line/bot-sdk";

type BuildRedeemApprovalCardParams = {
  requestId: string;
  studentId: string | number;
  name: string;
  productName: string;
  price: number;
  imageUrl?: string | null;
};

function buildInfoRow(label: string, value: string) {
  return {
    type: "box",
    layout: "baseline",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: label,
        color: "#64748B",
        size: "sm",
        flex: 3,
      },
      {
        type: "text",
        text: value,
        color: "#0F172A",
        size: "sm",
        wrap: true,
        flex: 5,
      },
    ],
  };
}

export function buildRedeemApprovalCard(
  params: BuildRedeemApprovalCardParams
): messagingApi.FlexMessage {
  const contents: Record<string, unknown> = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "Redeem Request",
          weight: "bold",
          size: "xl",
          color: "#0F172A",
        },
        {
          type: "text",
          text: "Pending approval",
          size: "sm",
          color: "#F59E0B",
          weight: "bold",
        },
        {
          type: "separator",
          margin: "md",
        },
        buildInfoRow("Product", params.productName),
        buildInfoRow("Student ID", String(params.studentId)),
        buildInfoRow("Name", params.name),
        buildInfoRow("Price", `${params.price} tokens`),
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#22C55E",
          action: {
            type: "postback",
            label: "Approve",
            data: `action=approve_redeem&requestId=${encodeURIComponent(
              params.requestId
            )}`,
            displayText: "Approve redeem request",
          },
        },
        {
          type: "button",
          style: "link",
          action: {
            type: "postback",
            label: "Cancel",
            data: `action=cancel_redeem&requestId=${encodeURIComponent(
              params.requestId
            )}`,
            displayText: "Cancel redeem request",
          },
        },
      ],
    },
  };

  if (params.imageUrl) {
    contents.hero = {
      type: "image",
      url: params.imageUrl,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
    };
  }

  return {
    type: "flex",
    altText: `Redeem request ${params.requestId}`,
    contents,
  } as messagingApi.FlexMessage;
}
