import type { webhook } from "@line/bot-sdk";

const DEFAULT_WINDOW_MS = 30 * 1000;
const lastRequestAtByKey = new Map<string, number>();

function getSourceKey(event: webhook.MessageEvent) {
  const source = event.source;

  if (!source) {
    return "unknown";
  }

  if (source.type === "group") {
    return `group:${source.groupId}`;
  }

  if (source.type === "room") {
    return `room:${source.roomId}`;
  }

  return `user:${source.userId}`;
}

export function checkLineCommandRateLimit(
  event: webhook.MessageEvent,
  windowMs = DEFAULT_WINDOW_MS
) {
  const key = getSourceKey(event);
  const now = Date.now();
  const lastRequestAt = lastRequestAtByKey.get(key) ?? 0;
  const elapsedMs = now - lastRequestAt;

  if (elapsedMs < windowMs) {
    const retryAfterSeconds = Math.ceil((windowMs - elapsedMs) / 1000);

    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  lastRequestAtByKey.set(key, now);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}
