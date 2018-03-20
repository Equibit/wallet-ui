/**
 * Custom error object that allows to pass extra data
 */
class ErrorData extends Error {
  constructor(data, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorData);
    }

    // Custom debugging information
    this.data = data;
  }
}

export default ErrorData
