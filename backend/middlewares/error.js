const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // ? mongoDb caste Error handling
  if (err.name === " CasteError") {
    const message = `Resource not Found, Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // ? mongoDB duplicate key error
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} Already Exist `;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid, Try again :( `;
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again :( `;
    err = new ErrorHandler(message, 400);
  }

  console.log("error", err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
