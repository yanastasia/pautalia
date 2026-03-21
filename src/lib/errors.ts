export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "CONFLICT"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  code: ErrorCode;
  status: number;
  fields?: Record<string, string>;
  details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    options?: {
      fields?: Record<string, string>;
      details?: Record<string, unknown>;
    },
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.fields = options?.fields;
    this.details = options?.details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function validationError(message: string, fields?: Record<string, string>) {
  return new AppError("VALIDATION_ERROR", message, 400, { fields });
}

export function unauthorizedError(message = "Authentication required") {
  return new AppError("UNAUTHORIZED", message, 401);
}

export function forbiddenError(message = "You do not have permission to perform this action") {
  return new AppError("FORBIDDEN", message, 403);
}

export function notFoundError(message = "Resource not found") {
  return new AppError("NOT_FOUND", message, 404);
}

export function rateLimitError(message = "Too many requests. Try again later.") {
  return new AppError("RATE_LIMITED", message, 429);
}

export function conflictError(message = "The request conflicts with the current resource state") {
  return new AppError("CONFLICT", message, 409);
}

export function serviceUnavailableError(message = "Service temporarily unavailable") {
  return new AppError("SERVICE_UNAVAILABLE", message, 503);
}
