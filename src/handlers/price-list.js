const BotError = require('../config/error-handler');
const { fetchPage } = require('../utils/http');
const { handleError } = require('../utils/error');
const {
  getPageUrl,
  preparePlaceInformation,
  getAveragePrice,
  getPriceList,
  isBotCommand,
  interactionAfterAnAction
} = require('../utils/price-list');

const handlePriceList = async ctx => {
  const { i18n, message, session, replyWithHTML, reply } = ctx;

  if (session.isPriceListMode) {
    try {
      const incommingMessage = message.text;
      if (isBotCommand(incommingMessage)) {
        const incorrectBotCommand = i18n.t('incorrectBotCommand');

        throw new BotError(incorrectBotCommand, true);
      }

      const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
      const { country, city, state } = await preparePlaceInformation(incommingMessage, i18n);
      const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace: `${country}, ${city}` });

      await reply(gettingPriceListMessage);

      const pageUrl = getPageUrl(process.env.PRICE_LIST_PAGE_URL, i18n.languageCode, country, city, state);
      const webpage = await fetchPage(pageUrl);
      const priceList = await getPriceList(webpage.data, i18n, session);
      const averagePrice = await getAveragePrice(session, webpage.data, averagePriceReplacementTextPart);
      const priceListPromises = Promise.all(priceList.map(price => replyWithHTML(price)));

      priceListPromises.then(() => replyWithHTML(averagePrice));
    } catch(err) {
      if (err.isAxiosError) {
        const status = err.response.status;
        const message = status && status === 404 ? i18n.t('placeNotFound') : err.message;
        const isUserError = status ? true : false;

        handleError(new BotError(message, isUserError), ctx);
      } else {
        handleError(err, ctx);
      }
    }
  } else {
    session.amountOfPersons = message.text;
    session.isPriceListMode = true;

    const chosenAmountOfPersonsMessage = i18n.t('chosenAmountOfPersonsMessage', { chosenAmountOfPersons: session.amountOfPersons });

    await interactionAfterAnAction(ctx, chosenAmountOfPersonsMessage);
  }
};

module.exports = { handlePriceList };
