const { Markup } = require('telegraf');

const WELCOME_MESSAGE = 'Hello from IKnowThePrice_Bot!';
const COMMANDS_MESSAGE = 'Below are the commands that you can use to work with the bot.';
const GET_PRICE_LIST_MESSAGE = 'To get the price list of a place just type the place name!';
const LANGUAGE_QUESTION_MESSAGE = 'What language do you want to use? Choose the appropriate language!';
const INFORMATION_AFTER_ACTION_MESSAGE = 'Or type /help to get additional information!';

const START_RU_ACTION_MESSAGE = '/start - Начало работы бота';
const LANGUAGE_RU_ACTION_MESSAGE = '/language - Смена языка бота';
const HELP_RU_ACTION_MESSAGE = '/help - Отображение используемых команд';
const START_EN_ACTION_MESSAGE = '/start - Bot starts working';
const LANGUAGE_EN_ACTION_MESSAGE = '/language - Change the language of the bot';
const HELP_EN_ACTION_MESSAGE = '/help - Display all commands of the bot';

const PLACES_SELECTOR = '#container #center #node .main_menu_column > a';
const HEADERS_SELECTOR = 'div[id="container"] div[id="node"] h2';
const LIST_SELECTOR = 'div[id="container"] div[id="node"] > ul';

const RU_FILE_NAME = 'places_ru.json';
const EN_FILE_NAME = 'places_en.json';

const RU_ACTION_BUTTON = Markup.callbackButton('RU', 'ru');
const EN_ACTION_BUTTON = Markup.callbackButton('EN', 'en');

const HELP_RU_ACTION_RESPONSE = `${START_RU_ACTION_MESSAGE}\n${LANGUAGE_RU_ACTION_MESSAGE}\n${HELP_RU_ACTION_MESSAGE}`;
const HELP_EN_ACTION_RESPONSE = `${START_EN_ACTION_MESSAGE}\n${LANGUAGE_EN_ACTION_MESSAGE}\n${HELP_EN_ACTION_MESSAGE}`;

const LANGUAGE_ACTION_BUTTONS = [RU_ACTION_BUTTON, EN_ACTION_BUTTON];

module.exports = {
  WELCOME_MESSAGE,
  COMMANDS_MESSAGE,
  GET_PRICE_LIST_MESSAGE,
  LANGUAGE_QUESTION_MESSAGE,
  INFORMATION_AFTER_ACTION_MESSAGE,
  PLACES_SELECTOR,
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  RU_FILE_NAME,
  EN_FILE_NAME,
  HELP_RU_ACTION_RESPONSE,
  HELP_EN_ACTION_RESPONSE,
  LANGUAGE_ACTION_BUTTONS
};
