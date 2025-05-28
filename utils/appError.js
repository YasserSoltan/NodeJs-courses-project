class AppError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode, statusText) {
    this.message = message || "Something went wrong";
    this.statusCode = statusCode;
    this.statusText = statusText || "Internal Server Error";
    return this;
  }
}

module.exports = new AppError();