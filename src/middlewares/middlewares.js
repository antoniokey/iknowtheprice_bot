const botMiddleware = () => (ctx, next) => {
  if (!ctx.session.amountOfPersons) {
    ctx.session.amountOfPersons = 1;
  }

  next();
};

module.exports = { botMiddleware };
