const HEADERS_SELECTOR = 'main > div > div > h3';
const LIST_SELECTOR = 'main > div > div > div[id*="g-"]';
const AVERAGE_PRICE = 'main > div > div > div.estimate > p';

const USD_CURRENCY_CODE = 'USD';
const EUR_CURRENCY_CODE = 'EUR';
const RUB_CURRENCY_CODE = 'RUB';
const USD_CURRENCY_SIGN = '$';
const EUR_CURRENCY_SIGN = '€';
const RUB_CURRENCY_SIGN = '₽';

const RUSSIAN_LANGUAGE = 'Русский';
const ENGLISH_LANGUAGE = 'English';
const SPANISH_LANGUAGE = 'Español';

const NEW_LINE_SYMBOLS = /\n/g;
const UNSUTABLE_TRANSLATE_SYMBOLS = /[a-z\-A-Z]+/g;

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
  PERMITTED_COMMANDS,
  RUSSIAN_LANGUAGE,
  ENGLISH_LANGUAGE,
  SPANISH_LANGUAGE
};
