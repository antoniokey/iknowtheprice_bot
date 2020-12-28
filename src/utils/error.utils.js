const handleError = (err, ctx) => {
  if (err.isUserError) {
    ctx.reply(err.message);
  } else {
    console.log(err.message);
  }
};

module.exports = { handleError };
