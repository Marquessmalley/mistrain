class AppError extends Error {
  constructor(message, statusCode) {
    // call super inorder to call Error constructor
    super(message);
    this.statusCode = statusCode;
    // status depends on the status code
    // 400= client failure
    // 500 = internal server error
    this.status = `${statusCode}`.startsWith(4)
      ? "client failure"
      : "internal server error";

    this.isOperational = true;
    this.errMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
