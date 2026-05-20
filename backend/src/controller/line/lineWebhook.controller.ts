import type { Request, Response } from "express";
import type { webhook } from "@line/bot-sdk";
import { handleLineMessage } from "../../services/line/handleLineMessage.js";
import { handleLinePostback } from "../../services/line/handleLinePostback.js";

type LineWebhookBody = {
  events?: webhook.Event[];
};

function isLineWebhookBody(value: unknown): value is LineWebhookBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as LineWebhookBody;
  return body.events === undefined || Array.isArray(body.events);
}

function logGroupIdForSetup(event: webhook.Event) {
  const source = event.source;

  if (event.type !== "message" || !source || source.type !== "group") {
    return;
  }

  console.log("[LINE] groupId for approval setup:", source.groupId);
}

async function handleLineEvent(event: webhook.Event) {
  if (event.type === "message") {
    logGroupIdForSetup(event);
    await handleLineMessage(event);
    return;
  }

  if (event.type === "postback") {
    await handleLinePostback(event);
    return;
  }

  console.log("[LINE] ignored event type:", event.type);
}

export async function lineWebhookController(req: Request, res: Response) {
  if (!isLineWebhookBody(req.body)) {
    console.warn("[LINE] invalid webhook body");
    return res.status(400).json({ message: "Invalid LINE webhook body" });
  }

  const body = req.body;
  const events = body.events ?? [];

  try {
    await Promise.all(events.map(handleLineEvent));

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[LINE] webhook handling failed:", error);
    return res.status(500).json({ message: "Failed to handle LINE webhook" });
  }
}
