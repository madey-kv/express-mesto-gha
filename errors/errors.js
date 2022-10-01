// eslint-disable-next-line max-classes-per-file
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  DefaultError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
