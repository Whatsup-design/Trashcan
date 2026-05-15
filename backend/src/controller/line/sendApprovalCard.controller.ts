import type { Request, Response } from "express";
import { sendRedeemApprovalCard } from "../../services/line/sendRedeemApprovalCard.js";

function getRequestId(value: unknown) {
  if (typeof value !== "string") {
    return "TEST-001";
  }

  const normalizedValue = value.trim();
  return normalizedValue || "TEST-001";
}

export async function sendApprovalCardController(req: Request, res: Response) {
  const requestId = getRequestId(req.body?.requestId);

  await sendRedeemApprovalCard({
    requestId,
    studentId: "16001",
    name: "Sansan",
    productName: "Water Bottle",
    price: 30,
    imageUrl: "https://placehold.co/1000x650/png",
  });

  return res.json({
    success: true,
    message: "Test approval card sent",
    requestId,
  });
}
