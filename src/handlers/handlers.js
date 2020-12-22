const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const { getPriceList } = require('../utils/utils');
const { LANGUAGE_ACTION_BUTTONS } = require('../constants/constants');

const handleLanguage = ctx => {
  const languageQuestionMessage = ctx.i18n.t('languageQuestionMessage');

  ctx.reply(languageQuestionMessage, Extra.HTML().markup(Markup.inlineKeyboard(LANGUAGE_ACTION_BUTTONS)));
};

const handleStart = async ctx => {
  const welcomeMessage = ctx.i18n.t('welcomeMessage');
  const commandsMessage = ctx.i18n.t('commandsMessage');

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
    const language = ctx.i18n.languageCode;
    const places = require(`../places/places_${language}.json`);
    const incomingText = ctx.message.text;
    const incomingPlace = incomingText[0].toUpperCase() + incomingText.slice(1);
    const gettingPriceListMessage = ctx.i18n.t('gettingPriceListMessage', { incomingPlace });

    await ctx.reply(gettingPriceListMessage);

    const url = places.find(place => place.title === incomingPlace).url;
    const webpage = await axios.get(url);

    await ctx.replyWithHTML(getPriceList(webpage.data));
  } catch(err) {
    console.log(err.message);
  }
};

module.exports = { handleLanguage, handleStart, handleHelp, handleLanguageAction, handleText  };
