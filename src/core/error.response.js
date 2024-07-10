const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  NOT_FOUND: 404,
};
const ReasonStatusCode = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  CONFLICT: "Conflict",
  NOT_FOUND: "Not Found",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message, statusCode) {
    super(
      (message = ReasonStatusCode.CONFLICT),
      (statusCode = StatusCode.CONFLICT)
    );
  }
}
class BadRequestError extends ErrorResponse {
  constructor(message, statusCode) {
    super(
      (message = ReasonStatusCode.BAD_REQUEST),
      (statusCode = StatusCode.BAD_REQUEST)
    );
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message, statusCode) {
    super(
      (message = ReasonStatusCode.FORBIDDEN),
      (statusCode = StatusCode.FORBIDDEN)
    );
  }
}
class UnauthorizedError extends ErrorResponse {
  constructor(message, statusCode) {
    super(
      (message = ReasonStatusCode.UNAUTHORIZED),
      (statusCode = StatusCode.UNAUTHORIZED)
    );
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message, statusCode) {
    super(
      (message = ReasonStatusCode.NOT_FOUND),
      (statusCode = StatusCode.NOT_FOUND)
    );
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
