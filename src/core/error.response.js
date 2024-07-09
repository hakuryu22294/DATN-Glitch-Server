const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_SERVER: 500,
};
const ReasonStatusCode = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  UNPROCESSABLE: "Unprocessable Entity",
  INTERNAL_SERVER: "Internal Server Error",
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

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
