const BotError = require('../config/error-handler');
const { USD_CURRENCY_CODE } = require('../constants/constants');
const { handleError } = require('../utils/error.utils');
const { fetchPage } = require('../utils/http.utils');
const {
  getPageUrl,
  preparePlaceInformation,
  getAveragePrice,
  getPriceList,
  isBotCommand,
  interactionAfterAnAction,
  showPriceListMessage
} = require('../utils/bot.utils');
const { LanguageMenu, CurrencyMenu, CancelMenu } = require('../config/inline-menu');
const { showMainMenu } = require('../utils/inline-menu');

const handleStart = async ctx => {
  const { session, i18n, reply } = ctx;

  i18n.languageCode = 'ru';

  const welcomeMessage = i18n.t('welcomeMessage');

  session.amountOfPersons = 1;
  session.priceListCurrencyCode = USD_CURRENCY_CODE;
  session.isPriceListMode = true;

  await reply(welcomeMessage);
  await showMainMenu(ctx);
};

const handleGetLanguage = async ctx => {
  const languageMessage = ctx.i18n.t('choosenLanguageMessage');

  await ctx.reply(languageMessage);
};

const handleGetCurrency = async ctx => {
  const { session, i18n } = ctx;
  const choosenCurrency = session.priceListCurrencyCode;
  const currencyMessage = i18n.t('choosenCurrencyMessage', { choosenCurrency });

  await ctx.reply(currencyMessage);
};

const handleGetAmountOfPersons = async ctx => {
  const { session, i18n } = ctx;
  const choosenAmountOfPersons = session.amountOfPersons;
  const choosenAmountOfPersonsMessage = i18n.t('choosenAmountOfPersonsMessage', { choosenAmountOfPersons });

  await ctx.reply(choosenAmountOfPersonsMessage);
};

const handleSetLanguage = async ctx => {
  const { reply, i18n } = ctx;
  const setLanguageQuestionMessage = i18n.t('setLanguageQuestionMessage');

  await reply(setLanguageQuestionMessage, LanguageMenu.getLanguageMenu(i18n));
};

const handleSetCurrency = async ctx => {
  const { reply, i18n } = ctx;
  const setCurrencyQuestionMessage = i18n.t('setCurrencyQuestionMessage');

  await reply(setCurrencyQuestionMessage, CurrencyMenu.getCurrencyMenu());
};

const handleSetAmountOfPersons = async ctx => {
  const { reply, i18n, session } = ctx;
  const setAmountOfPersonsQuestionMessage = i18n.t('setAmountOfPersonsQuestionMessage');

  session.isPriceListMode = false;

  await reply(setAmountOfPersonsQuestionMessage, CancelMenu.getCancelMenu(i18n));
};

const handleHelp = async ctx => {
  await showMainMenu(ctx);
};

const handleSetLanguageAction = async ctx => {
  const language = ctx.match;

  ctx.i18n.locale(language);

  const choosenLanguageMessage = ctx.i18n.t('choosenLanguageMessage');

  await interactionAfterAnAction(ctx, choosenLanguageMessage);
};

const handleSetCurrencyAction = async ctx => {
  const choosenCurrency = ctx.match.toUpperCase();

  ctx.session.priceListCurrencyCode = choosenCurrency;

  const choosenCurrencyMessage = ctx.i18n.t('choosenCurrencyMessage', { choosenCurrency });

  await interactionAfterAnAction(ctx, choosenCurrencyMessage);
}

const handleText = async ctx => {
  const { i18n, message, session, replyWithHTML, reply } = ctx;
  const environmentPageUrl = process.env.PRICE_LIST_PAGE_URL;

  if (session.isPriceListMode) {
    try {
      const incommingMessage = message.text;
      if (isBotCommand(incommingMessage)) {
        const incorrectBotCommand = i18n.t('incorrectBotCommand');

        throw new BotError(incorrectBotCommand, true);
      }

      const language = i18n.languageCode;
      const amountOfPersons = session.amountOfPersons;
      const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
      const { country, city, state } = await preparePlaceInformation(incommingMessage, i18n);
      const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace: `${country}, ${city}` });

      await reply(gettingPriceListMessage);

      const pageUrl = getPageUrl(environmentPageUrl, language, country, city, state);
      const webpage = await fetchPage(pageUrl);
      const priceList = await getPriceList(webpage.data, i18n, session);
      const averagePrice = getAveragePrice(webpage.data, amountOfPersons, averagePriceReplacementTextPart);
      const priceListPromises = Promise.all(priceList.map(price => replyWithHTML(price)));

      priceListPromises.then(() => {
        replyWithHTML(averagePrice);
      });
    } catch(err) {
      if (err.isAxiosError) {
        const message = err.response.status ? i18n.t('placeNotFound') : err.message;
        const isUserError = err.response.status ? true : false;

        handleError(new BotError(message, isUserError), ctx);
      } else {
        handleError(err, ctx);
      }
    }
  } else {
    session.amountOfPersons = message.text;
    session.isPriceListMode = true;

    const choosenAmountOfPersonsMessage = i18n.t('choosenAmountOfPersonsMessage', { choosenAmountOfPersons: session.amountOfPersons });

    await interactionAfterAnAction(ctx, choosenAmountOfPersonsMessage);
  }
};

const handleCancel = async ctx => {
  if (!ctx.session.isPriceListMode) {
    ctx.session.isPriceListMode = true;
  }

  await showPriceListMessage(ctx);
};

module.exports = {
  handleSetLanguage,
  handleStart,
  handleHelp,
  handleSetLanguageAction,
  handleText,
  handleSetCurrency,
  handleSetCurrencyAction,
  handleGetLanguage,
  handleGetCurrency,
  handleGetAmountOfPersons,
  handleSetAmountOfPersons,
  handleCancel
};
