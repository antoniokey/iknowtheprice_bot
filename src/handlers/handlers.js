const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const { getPriceList } = require('../utils/utils');
const { LANGUAGE_ACTION_BUTTONS } = require('../constants/constants');
const { getPageUrl, getInformationForAPlace, getAveragePrice } = require('../utils/utils');

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
  try {
    const { i18n, message, session, replyWithHTML, reply } = ctx;
    const environmentPageUrl = process.env.PAGE_URL;
    const language = i18n.languageCode;
    const incomingPlace = message.text;
    const sessionAmountOfPersons = session.amountOfPersons;
    const averagePriceReplacementTextPart = i18n.t('averagePriceReplacementTextPart');
    const { country, city, amountOfPersons } = await getInformationForAPlace(incomingPlace, i18n, sessionAmountOfPersons);
    const gettingPriceListMessage = i18n.t('gettingPriceListMessage', { incomingPlace });

    await reply(gettingPriceListMessage);

    const pageUrl = getPageUrl(environmentPageUrl, language, country, city);
    const webpage = await axios.get(pageUrl);
    const priceList = getPriceList(webpage.data);
    const averagePrice = getAveragePrice(webpage.data, amountOfPersons, averagePriceReplacementTextPart);
    const priceListPromises = Promise.all(priceList.map(price => replyWithHTML(price)));

    priceListPromises.then(() => {
      replyWithHTML(averagePrice);
    });
  } catch(err) {
    console.log(err.message);
  }
};

module.exports = { handleLanguage, handleStart, handleHelp, handleLanguageAction, handleText  };
