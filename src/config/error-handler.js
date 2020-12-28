
class BotError extends Error {

  constructor(message, isUserError) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.isUserError = isUserError;

    Error.captureStackTrace(this);
  }

}

module.exports = BotError;
