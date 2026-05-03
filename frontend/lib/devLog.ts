const isDevelopment = process.env.NODE_ENV !== "production";

export function logDevError(scope: string, error: unknown) {
  if (!isDevelopment) {
    return;
  }

  console.error(`[${scope}]`, error);
}

export function logDevInfo(scope: string, message: string, details?: unknown) {
  if (!isDevelopment) {
    return;
  }

  if (details === undefined) {
    console.info(`[${scope}] ${message}`);
    return;
  }

  console.info(`[${scope}] ${message}`, details);
}
