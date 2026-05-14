import type { Request, Response } from "express";
import type { webhook } from "@line/bot-sdk";
import { handleLinePostback } from "../../services/line/handleLinePostback.js";

type LineWebhookBody = {
  events?: webhook.Event[];
};

function logGroupIdForSetup(event: webhook.Event) {
  if (event.type !== "message" || event.source?.type !== "group") {
    return;
  }

  console.log("[LINE] groupId for approval setup:", event.source.groupId);
}

export async function lineWebhookController(req: Request, res: Response) {
  const body = req.body as LineWebhookBody;
  const events = body.events ?? [];

  try {
    await Promise.all(
      events.map(async (event) => {
        console.log("[LINE] incoming event:", event.type);
        logGroupIdForSetup(event);

        if (event.type === "postback") {
          await handleLinePostback(event);
        }
      })
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[LINE] webhook handling failed:", error);
    return res.status(500).json({ message: "Failed to handle LINE webhook" });
  }
}
