import type { ErrorRequestHandler, RequestHandler } from "express";

type ApiError = Error & {
  statusCode?: number;
  code?: string;
};

export const notFoundMiddleware: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const error = err as ApiError;
  const statusCode = error.statusCode ?? 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    message:
      process.env.NODE_ENV === "production" && statusCode >= 500
        ? "Internal server error"
        : error.message || "Unexpected error",
    code: error.code,
  });
};
