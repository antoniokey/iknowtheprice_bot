const { Markup } = require('telegraf');

const HEADERS_SELECTOR = 'main > div > div > h3';
const LIST_SELECTOR = 'main > div > div > div[id*="g-"]';
const AVERAGE_PRICE = 'main > div > div > div.estimate > p';

const NEW_LINE_SYMBOLS = /\n/g;
const UNSUTABLE_TRANSLATE_SYMBOLS = /[a-z\-A-Z]+/g;

const RU_ACTION_BUTTON = Markup.callbackButton('Русский', 'ru');
const EN_ACTION_BUTTON = Markup.callbackButton('English', 'en');
const ES_ACTION_BUTTON = Markup.callbackButton('Español', 'es');

const LANGUAGE_ACTION_BUTTONS = [RU_ACTION_BUTTON, EN_ACTION_BUTTON, ES_ACTION_BUTTON];

module.exports = {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  AVERAGE_PRICE,
  NEW_LINE_SYMBOLS,
  UNSUTABLE_TRANSLATE_SYMBOLS,
  LANGUAGE_ACTION_BUTTONS
};
