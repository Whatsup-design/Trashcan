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
          text: "Redeemed",
          weight: "bold",
          size: "xl",
          color: "#0F172A",
        },
        {
          type: "text",
          text: "New redeem activity",
          size: "sm",
          color: "#22C55E",
          weight: "bold",
        },
        {
          type: "separator",
          margin: "md",
        },
        buildInfoRow("Product", params.productName),
        buildInfoRow("Student ID", String(params.studentId)),
        buildInfoRow("Name", params.name),
        buildInfoRow("Tokens", `${params.price}`),
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
    altText: `Redeemed ${params.productName}`,
    contents,
  } as messagingApi.FlexMessage;
}
