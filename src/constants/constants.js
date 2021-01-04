const { Markup } = require('telegraf');

const HEADERS_SELECTOR = 'main > div > div > h3';
const LIST_SELECTOR = 'main > div > div > div[id*="g-"]';
const AVERAGE_PRICE = 'main > div > div > div.estimate > p';

const USD_CURRENCY_CODE = 'USD';
const EUR_CURRENCY_CODE = 'EUR';
const RUB_CURRENCY_CODE = 'RUB';
const USD_CURRENCY_SIGN = '$';
const EUR_CURRENCY_SIGN = '€';
const RUB_CURRENCY_SIGN = '₽';

const NEW_LINE_SYMBOLS = /\n/g;
const UNSUTABLE_TRANSLATE_SYMBOLS = /[a-z\-A-Z]+/g;

const RU_ACTION_BUTTON = Markup.callbackButton('Русский', 'ru');
const EN_ACTION_BUTTON = Markup.callbackButton('English', 'en');
const ES_ACTION_BUTTON = Markup.callbackButton('Español', 'es');

const USD_CURRENCY_ACTION_BUTTON = Markup.callbackButton(USD_CURRENCY_CODE, 'usd');
const RUB_CURRENCY_ACTION_BUTTON = Markup.callbackButton(RUB_CURRENCY_CODE, 'rub');
const EUR_CURRENCY_ACTION_BUTTON = Markup.callbackButton(EUR_CURRENCY_CODE, 'eur');

const CANCEL_ACTION_BUTTON = Markup.callbackButton('Cancel', 'cancel');

const LANGUAGE_ACTION_BUTTONS = [RU_ACTION_BUTTON, EN_ACTION_BUTTON, ES_ACTION_BUTTON];
const CURRENCY_ACTION_BUTTONS = [USD_CURRENCY_ACTION_BUTTON, RUB_CURRENCY_ACTION_BUTTON, EUR_CURRENCY_ACTION_BUTTON];

const PERMITTED_COMMANDS = [
  '/start',
  '/help',
  '/setlanguage',
  '/setcurrency',
  '/setamountofpersons',
  '/getlanguage',
  '/getcurrency',
  '/getamountofpersons'
];

module.exports = {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  AVERAGE_PRICE,
  USD_CURRENCY_CODE,
  EUR_CURRENCY_CODE,
  RUB_CURRENCY_CODE,
  USD_CURRENCY_SIGN,
  EUR_CURRENCY_SIGN,
  RUB_CURRENCY_SIGN,
  NEW_LINE_SYMBOLS,
  UNSUTABLE_TRANSLATE_SYMBOLS,
  LANGUAGE_ACTION_BUTTONS,
  CURRENCY_ACTION_BUTTONS,
  PERMITTED_COMMANDS,
  CANCEL_ACTION_BUTTON
};
