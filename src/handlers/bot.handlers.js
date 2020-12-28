const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const BotError = require('../config/error-handler');
const { LANGUAGE_ACTION_BUTTONS } = require('../constants/constants');
const { getPageUrl, getInformationForAPlace, getAveragePrice, getPriceList } = require('../utils/bot.utils');
const { handleError } = require('../utils/error.utils');

const handleLanguage = ctx => {
  const languageQuestionMessage = ctx.i18n.t('languageQuestionMessage');

  ctx.reply(languageQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(LANGUAGE_ACTION_BUTTONS)));
};

const handleStart = async ctx => {
  const welcomeMessage = ctx.i18n.t('welcomeMessage');
  const commandsMessage = ctx.i18n.t('commandsMessage');

  ctx.session.amountOfPersons = 1;

  await ctx.reply(welcomeMessage);
  await ctx.reply(commandsMessage);
  await handleHelp(ctx);
};

const handleHelp = async ctx => {
  const startActionMessage = ctx.i18n.t('startActionMessage');
  const languageActionMessage = ctx.i18n.t('languageActionMessage');
  const helpActionMessage = ctx.i18n.t('helpActionMessage');
  const getPriceListMessage = ctx.i18n.t('getPriceListMessage');
  
  await ctx.reply(`${startActionMessage}\n${languageActionMessage}\n${helpActionMessage}`);
  await ctx.reply(getPriceListMessage);
};

const handleLanguageAction = async ctx => {
  const language = ctx.match;

  ctx.i18n.locale(language);

  const changeLanguageMessage = ctx.i18n.t('changeLanguageMessage');
  const getPriceListMessage = ctx.i18n.t('getPriceListMessage');

  await ctx.reply(changeLanguageMessage);
  await ctx.reply(getPriceListMessage);
};

const handleText = async ctx => {
  const { i18n, message, session, replyWithHTML, reply } = ctx;
  const environmentPageUrl = process.env.PAGE_URL;

  try {
    const language = i18n.languageCode;
    const incomingPlace = message.text;
    const sessionAmountOfPersons = session.amountOfPersons;
    const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
    const { country, city, amountOfPersons } = await getInformationForAPlace(incomingPlace, i18n, sessionAmountOfPersons);
    const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace: `${country}, ${city}` });

    await reply(gettingPriceListMessage);

    const pageUrl = getPageUrl(environmentPageUrl, language, country, city);
    const webpage = await axios.get(pageUrl);
    const priceList = getPriceList(webpage.data, i18n);
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

module.exports = { handleLanguage, handleStart, handleHelp, handleLanguageAction, handleText  };
