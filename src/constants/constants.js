const { Markup } = require('telegraf');

const HEADERS_SELECTOR = 'main > div > div > h3';
const LIST_SELECTOR = 'main > div > div > div[id*="g-"]';
const AVERAGE_PRICE = 'main > div > div > div.estimate > p';

const NEW_LINE_SYMBOLS = /\n/g;

const RU_ACTION_BUTTON = Markup.callbackButton('RU', 'ru');
const EN_ACTION_BUTTON = Markup.callbackButton('EN', 'en');
const ES_ACTION_BUTTON = Markup.callbackButton('ES', 'es');

const LANGUAGE_ACTION_BUTTONS = [RU_ACTION_BUTTON, EN_ACTION_BUTTON, ES_ACTION_BUTTON];

module.exports = {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  AVERAGE_PRICE,
  NEW_LINE_SYMBOLS,
  LANGUAGE_ACTION_BUTTONS
};
