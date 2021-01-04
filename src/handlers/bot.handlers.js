const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const BotError = require('../config/error-handler');
const { LANGUAGE_ACTION_BUTTONS, USD_CURRENCY_CODE, CURRENCY_ACTION_BUTTONS } = require('../constants/constants');
const { getPageUrl, getInformationForAPlace, getAveragePrice, getPriceList, getEditPartOfHelp, getInformationalPartOfHelp, isBotCommand, getCountry } = require('../utils/bot.utils');
const { handleError } = require('../utils/error.utils');

const handleStart = async ctx => {
  const { session, i18n, reply } = ctx;

  i18n.languageCode = 'ru';

  const welcomeMessage = i18n.t('welcomeMessage');
  const commandsMessage = i18n.t('commandsMessage');

  session.amountOfPersons = 1;
  session.priceListCurrencyCode = USD_CURRENCY_CODE;

  await reply(welcomeMessage);
  await reply(commandsMessage);
  await handleHelp(ctx);
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

const handleSetLanguage = ctx => {
  const languageQuestionMessage = ctx.i18n.t('setLanguageQuestionMessage');

  ctx.reply(languageQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(LANGUAGE_ACTION_BUTTONS)));
};

const handleSetCurrency = async ctx => {
  const currencyQuestionMessage = ctx.i18n.t('setCurrencyQuestionMessage');

  await ctx.reply(currencyQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(CURRENCY_ACTION_BUTTONS)));
};

const handleHelp = async ctx => {
  const { i18n } = ctx;
  const editPart = getEditPartOfHelp(i18n);
  const informationalPart = getInformationalPartOfHelp(i18n);
  const startActionMessage = ctx.i18n.t('startActionMessage');
  const helpActionMessage = ctx.i18n.t('helpActionMessage');
  const getPriceListMessage = ctx.i18n.t('getPriceListMessage');
  
  await ctx.reply(`${startActionMessage}\n${helpActionMessage}\n\n${editPart}\n\n${informationalPart}`);
  await ctx.reply(getPriceListMessage);
};

const handleSetLanguageAction = async ctx => {
  const language = ctx.match;

  ctx.i18n.locale(language);

  const choosenLanguageMessage = ctx.i18n.t('choosenLanguageMessage');
  const getPriceListMessage = ctx.i18n.t('getPriceListMessage');

  await ctx.reply(choosenLanguageMessage);
  await ctx.reply(getPriceListMessage);
};

const handleSetCurrencyAction = async ctx => {
  const choosenCurrency = ctx.match.toUpperCase();

  ctx.session.priceListCurrencyCode = choosenCurrency;

  const choosenCurrencyMessage = ctx.i18n.t('choosenCurrencyMessage', { choosenCurrency });
  const getPriceListMessage = ctx.i18n.t('getPriceListMessage');

  await ctx.reply(choosenCurrencyMessage);
  await ctx.reply(getPriceListMessage);
}

const handleText = async ctx => {
  const { i18n, message, session, replyWithHTML, reply } = ctx;
  const environmentPageUrl = process.env.PAGE_URL;

  try {
    const incommingMessage = message.text;
    if (isBotCommand(incommingMessage)) {
      const incorrectBotCommand = i18n.t('incorrectBotCommand');

      throw new BotError(incorrectBotCommand, true);
    }

    const language = i18n.languageCode;
    const sessionAmountOfPersons = session.amountOfPersons;
    const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
    const { country, city, amountOfPersons } = await getInformationForAPlace(incommingMessage, i18n, sessionAmountOfPersons);
    // const countryXpath = await getCountry(city);
    const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace: `${country}, ${city}` });

    await reply(gettingPriceListMessage);

    const pageUrl = getPageUrl(environmentPageUrl, language, country, city);
    const webpage = await axios.get(pageUrl);
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
  handleGetCurrency
};
