const handleInitialSetupMiddleware = (ctx, next) => {
  if (!ctx.session.language) {
    ctx.session.language = 'en';
  }

  next();
};

module.exports = { handleInitialSetupMiddleware };
