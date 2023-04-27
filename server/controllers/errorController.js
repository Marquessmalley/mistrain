const AppError = require("../utills/appError");

const handleValidationError = (err) => {
  let messages = [];
  for (const key in err.errMessage.errors) {
    messages.push(err.errMessage.errors[key].message);
  }

  return new AppError(`Invalid data input: ${messages.join(",")}`, 400);
};

const handleDuplicateEmails = (err) => {
  return new AppError(`${err.errMessage.keyValue.email} already exists.`, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token, Try logining in.", 401);

const handleJWTExpire = () =>
  new AppError("Your token has expired, please login again", 401);

const sendError = (err, res) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  res
    .status(err.statusCode)
    .json({ status: err.status, message: err.errMessage });
};

module.exports.globalErrorHandling = (error, req, res, next) => {
  let err = { ...error };

  if (err.errMessage.name === "ValidationError")
    err = handleValidationError(err);
  if (err.errMessage.code === 11000) err = handleDuplicateEmails(err);
  if (error.errMessage.name === "JsonWebTokenError") err = handleJWTError();
  if (error.errMessage.name === "TokenExpiredError") err = handleJWTExpire();

  sendError(err, res);
};
