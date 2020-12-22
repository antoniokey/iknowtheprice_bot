const { Markup } = require('telegraf');

const PLACES_SELECTOR = '#container #center #node .main_menu_column > a';
const HEADERS_SELECTOR = 'div[id="container"] div[id="node"] h2';
const LIST_SELECTOR = 'div[id="container"] div[id="node"] > ul';

const RU_FILE_NAME = 'places_ru.json';
const EN_FILE_NAME = 'places_en.json';

const RU_ACTION_BUTTON = Markup.callbackButton('RU', 'ru');
const EN_ACTION_BUTTON = Markup.callbackButton('EN', 'en');
const ES_ACTION_BUTTON = Markup.callbackButton('ES', 'es');

const LANGUAGE_ACTION_BUTTONS = [RU_ACTION_BUTTON, EN_ACTION_BUTTON];

module.exports = {
  PLACES_SELECTOR,
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  RU_FILE_NAME,
  EN_FILE_NAME,
  LANGUAGE_ACTION_BUTTONS
};
