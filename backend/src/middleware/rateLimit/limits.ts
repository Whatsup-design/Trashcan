import { rateLimit } from "express-rate-limit";
import type { Request } from "express";
import { lineClient } from "../../lib/line.js";

function getDeviceKey(req: Request) {
  return req.header("x-device-id")?.trim() || req.ip || "unknown-device";
}

function getLineSourceKey(req: Request) {
  const event = req.body?.events?.[0];
  const source = event?.source;

  if (source?.type === "group" && source.groupId) {
    return `line-group:${source.groupId}`;
  }

  if (source?.type === "room" && source.roomId) {
    return `line-room:${source.roomId}`;
  }

  if (source?.userId) {
    return `line-user:${source.userId}`;
  }

  return req.ip || "unknown-line-source";
}

function hasAllRedeemCommand(req: Request) {
  const events = req.body?.events;

  if (!Array.isArray(events)) {
    return false;
  }

  return events.some((event) => {
    const text = event?.message?.type === "text" ? event.message.text : "";
    return typeof text === "string" && text.toLowerCase().includes("allre");
  });
}

async function replyLineRateLimitMessage(req: Request) {
  const event = req.body?.events?.find((item: unknown) => {
    const candidate = item as { replyToken?: unknown };
    return typeof candidate?.replyToken === "string";
  }) as { replyToken?: string } | undefined;

  if (!event?.replyToken) {
    return;
  }

  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "text",
        text: "Too many AllRe requests. Please wait a moment and try again.",
      },
    ],
  });
}

export const loginRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "ERROR",
    message: "Too many login attempts. Please try again later.",
  },
});

export const deviceScanRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getDeviceKey,
  message: {
    status: "ERROR",
    message: "Too many device scan requests. Please slow down.",
  },
});

export const deviceRegisterRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getDeviceKey,
  message: {
    status: "ERROR",
    message: "Too many device register requests. Please slow down.",
  },
});

export const deviceConfirmRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getDeviceKey,
  message: {
    status: "ERROR",
    message: "Too many device confirm requests. Please slow down.",
  },
});

export const lineAllRedeemRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 2,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getLineSourceKey,
  skip: (req) => !hasAllRedeemCommand(req),
  handler: async (req, res) => {
    try {
      await replyLineRateLimitMessage(req);
    } catch (error) {
      console.error("[LINE] failed to send rate limit reply:", error);
    }

    return res.status(200).json({
      ok: true,
      rateLimited: true,
      message: "Too many AllRe requests.",
    });
  },
});
