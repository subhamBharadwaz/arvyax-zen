class CustomError extends Error {
  httpCode: number;

  constructor(message: string, httpCode: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode;
    Error.captureStackTrace(this);
  }
}

export default CustomError;
