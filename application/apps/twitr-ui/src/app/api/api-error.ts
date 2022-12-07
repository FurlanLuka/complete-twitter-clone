export class ApiError extends Error {
  statusCode: number;
  text?: string;
  constructor(message: string, statusCode: number, text?: string) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = 'ApiError';
    // Custom debugging information
    this.statusCode = statusCode;
    this.text = text;
  }
}

export class UnauthenticatedApiError extends Error {
  statusCode: number;
  constructor() {
    super();
    this.statusCode = 401;
  }
}

export class UnauthorizedApiError extends Error {
  statusCode: number;
  requiredScopes: string;

  constructor(message: string, requiredScopes: string[] = []) {
    super();
    this.statusCode = 403;
    this.message = message;
    this.requiredScopes = requiredScopes.join(' ');
  }
}

export type ApiErrors =
  | ApiError
  | UnauthenticatedApiError
  | UnauthorizedApiError;
