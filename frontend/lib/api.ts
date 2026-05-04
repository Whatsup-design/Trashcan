import { readStoredToken } from "@/lib/auth/clientSession";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ApiRequestOptions = RequestInit & {
  redirectOnError?: boolean;
};

function getClientToken() {
  return readStoredToken();
}

export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, message: string, body = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function extractErrorMessage(status: number, statusText: string, body: string) {
  if (!body) {
    return `API request failed: ${status} ${statusText}`;
  }

  try {
    const parsed = JSON.parse(body) as { message?: string };
    if (parsed.message) {
      return parsed.message;
    }
  } catch {
    // Ignore non-JSON bodies and fall back to raw text below.
  }

  return `API request failed: ${status} ${statusText} - ${body}`;
}

export async function apiRequest(path: string, init?: ApiRequestOptions) {
  const { redirectOnError = true, ...requestInit } = init ?? {};
  const token = getClientToken();
  const isFormDataBody = typeof FormData !== "undefined" && requestInit.body instanceof FormData;
  const requestHeaders = new Headers(requestInit.headers ?? {});

  if (!isFormDataBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: requestHeaders,
      ...requestInit,
    });
  } catch (cause) {
    throw new ApiError(
      0,
      "Unable to reach server. Please try again.",
      cause instanceof Error ? cause.message : ""
    );
  }

  if (!res.ok) {
    const body = await res.text();
    const message = extractErrorMessage(res.status, res.statusText, body);
    const error = new ApiError(
      res.status,
      message,
      body
    );

    if (redirectOnError && typeof window !== "undefined" && [401, 403, 404].includes(res.status)) {
      window.location.replace(`/error/${res.status}`);
    }

    throw error;
  }

  return res.json();
}

export async function apiFetch(path: string) {
  return apiRequest(path, { method: "GET" });
}

export async function apiPost(
  path: string,
  body: unknown,
  init?: Omit<ApiRequestOptions, "method" | "body">
) {
  return apiRequest(path, {
    ...init,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export async function apiPut(path: string, body: unknown) {
  return apiRequest(path, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export async function apiPatch(path: string, body: unknown) {
  return apiRequest(path, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export async function apiDelete(path: string) {
  return apiRequest(path, {
    method: "DELETE",
  });
}
