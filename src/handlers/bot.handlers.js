const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const BotError = require('../config/error-handler');
const { LANGUAGE_ACTION_BUTTONS, USD_CURRENCY_CODE, CURRENCY_ACTION_BUTTONS, CANCEL_ACTION_BUTTON } = require('../constants/constants');
const { handleError } = require('../utils/error.utils');
const { fetchPage } = require('../utils/http.utils');
const {
  getPageUrl,
  getInformationForAPlace,
  getAveragePrice,
  getPriceList,
  getEditPartOfHelp,
  getInformationalPartOfHelp,
  isBotCommand,
  interactionAfterAnAction
} = require('../utils/bot.utils');

const handleStart = async ctx => {
  const { session, i18n, reply } = ctx;

  i18n.languageCode = 'ru';

  const welcomeMessage = i18n.t('welcomeMessage');
  const commandsMessage = i18n.t('commandsMessage');

  session.amountOfPersons = 1;
  session.priceListCurrencyCode = USD_CURRENCY_CODE;
  session.isPriceListMode = true;

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

const handleGetAmountOfPersons = async ctx => {
  const { session, i18n } = ctx;
  const choosenAmountOfPersons = session.amountOfPersons;
  const choosenAmountOfPersonsMessage = i18n.t('choosenAmountOfPersonsMessage', { choosenAmountOfPersons });

  await ctx.reply(choosenAmountOfPersonsMessage);
};

const handleSetLanguage = async ctx => {
  const setLanguageQuestionMessage = ctx.i18n.t('setLanguageQuestionMessage');

  await ctx.reply(setLanguageQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(LANGUAGE_ACTION_BUTTONS)));
};

const handleSetCurrency = async ctx => {
  const setCurrencyQuestionMessage = ctx.i18n.t('setCurrencyQuestionMessage');

  await ctx.reply(setCurrencyQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(CURRENCY_ACTION_BUTTONS)));
};

const handleSetAmountOfPersons = async ctx => {
  const setAmountOfPersonsQuestionMessage = ctx.i18n.t('setAmountOfPersonsQuestionMessage');

  ctx.session.isPriceListMode = false;

  await ctx.reply(setAmountOfPersonsQuestionMessage, Extra.markup(Markup.inlineKeyboard([CANCEL_ACTION_BUTTON])));
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

  if (session.isPriceListMode) {
    const environmentPageUrl = process.env.PRICE_LIST_PAGE_URL;

    try {
      const incommingMessage = message.text;
      if (isBotCommand(incommingMessage)) {
        const incorrectBotCommand = i18n.t('incorrectBotCommand');

        throw new BotError(incorrectBotCommand, true);
      }

      const language = i18n.languageCode;
      const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
      const { country, city, amountOfPersons } = await getInformationForAPlace(incommingMessage, i18n);
      const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace: `${country}, ${city}` });

      await reply(gettingPriceListMessage);

      const pageUrl = getPageUrl(environmentPageUrl, language, country, city);
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

  await interactionAfterAnAction(ctx);
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
