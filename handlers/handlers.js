const axios = require('axios');
const { Extra, Markup } = require('telegraf');
const { getPriceList } = require('../utils/utils');
const {
  WELCOME_MESSAGE,
  COMMANDS_MESSAGE,
  GET_PRICE_LIST_MESSAGE,
  INFORMATION_AFTER_ACTION_MESSAGE,
  HELP_EN_ACTION_RESPONSE,
  HELP_RU_ACTION_RESPONSE,
  LANGUAGE_QUESTION_MESSAGE,
  LANGUAGE_ACTION_BUTTONS
} = require('../constants/constants');

const handleLanguage = ctx => {
  ctx.reply(LANGUAGE_QUESTION_MESSAGE, Extra.HTML().markup(Markup.inlineKeyboard(LANGUAGE_ACTION_BUTTONS)));
};

const handleStart = async ctx => {
  await ctx.reply(WELCOME_MESSAGE);
  await ctx.reply(COMMANDS_MESSAGE);
  await handleHelp(ctx);
};

const handleHelp = async ctx => {
  const language = ctx.session.language;
  
  if (language === 'en') {
    await ctx.reply(HELP_EN_ACTION_RESPONSE);
  } else if (language === 'ru') {
    await ctx.reply(HELP_RU_ACTION_RESPONSE);
  }

  await ctx.reply(GET_PRICE_LIST_MESSAGE);
};

const handleLanguageAction = async ctx => {
  const language = ctx.match;
  const responseText = `You choose ${language.toUpperCase()} language! ${GET_PRICE_LIST_MESSAGE}`;

  ctx.session.language = language;

  await ctx.reply(responseText);
  await ctx.reply(INFORMATION_AFTER_ACTION_MESSAGE);
};

const handleText = async ctx => {
  try {
    const places = require(`../places/places_${ctx.session.language}.json`);
    const incomingText = ctx.message.text;
    const incomingPlace = incomingText[0].toUpperCase() + incomingText.slice(1);

    await ctx.reply(`Now the bot is getting all the price in ${incomingPlace}...`);

    const url = places.find(place => place.title === incomingPlace).url;
    const webpage = await axios.get(url);

    await ctx.replyWithHTML(getPriceList(webpage.data));
  } catch(err) {
    console.log(err.message);
  }
};

module.exports = { handleLanguage, handleStart, handleHelp, handleLanguageAction, handleText  };
