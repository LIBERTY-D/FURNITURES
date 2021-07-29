class API extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode || 500;
    this.operational = true;
    this.status = `${this.statusCode}`.startsWith("4") ? "Fail" : "Error";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = API;
