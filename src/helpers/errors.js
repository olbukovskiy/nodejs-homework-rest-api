class CustomError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class WrongParametersError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class NotFoundInfo extends CustomError {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class ConflictFieldError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.status).json({ message: error.message });
  }

  res.status(500).json({ message: error.message });
};

module.exports = {
  CustomError,
  ValidationError,
  WrongParametersError,
  NotFoundInfo,
  ConflictFieldError,
  UnauthorizedError,
  errorHandler,
};
