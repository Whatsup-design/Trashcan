import * as line from "@line/bot-sdk";

function requireEnv(name: string, value: string | undefined) {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`Missing required LINE environment variable: ${name}`);
  }

  return normalizedValue;
}

const channelSecret = requireEnv(
  "LINE_CHANNEL_SECRET",
  process.env.LINE_CHANNEL_SECRET
);

const channelAccessToken = requireEnv(
  "LINE_CHANNEL_ACCESS_TOKEN",
  process.env.LINE_CHANNEL_ACCESS_TOKEN ??
    process.env.LINE_CHANNEL_ACESS_TOKEN
);

export const lineConfig = {
  channelSecret,
  channelAccessToken,
};

export const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken,
});

export { line };
