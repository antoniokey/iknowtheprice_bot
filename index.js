require('dotenv').config();

const { Telegraf, session } = require('telegraf');
const { i18n } = require('./src/config/i18n');
const { Currency, Language, Action, Command } = require('./src/enum');
const { handleError } = require('./src/utils/error');
const { handleStart, handleHelp } = require('./src/handlers/command');
const { handlePriceList } = require('./src/handlers/price-list');
const {
  handleGetLanguage,
  handleGetCurrency,
  handleGetAmountOfPersons,
  handleSetLanguage,
  handleSetCurrency,
  handleSetAmountOfPersons,
  handleSetLanguageAction,
  handleSetCurrencyAction,
  handleCancel
} = require('./src/handlers/menu');

const API_TOKEN = process.env.API_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com';

const bot = new Telegraf(API_TOKEN);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

bot.use(session());
bot.use(i18n.middleware());

bot.command(Command.START, handleStart);
bot.command(Command.HELP, handleHelp);

bot.action(Action.GET_LANGUAGE, handleGetLanguage);
bot.action(Action.GET_CURRENCY, handleGetCurrency);
bot.action(Action.GET_AMOUNT_OF_PERSONS, handleGetAmountOfPersons);

bot.action(Action.SET_LANGUAGE, handleSetLanguage);
bot.action(Action.SET_CURRENCY, handleSetCurrency);
bot.action(Action.SET_AMOUNT_OF_PERSONS, handleSetAmountOfPersons);

bot.action(Language.RU, handleSetLanguageAction);
bot.action(Language.EN, handleSetLanguageAction);
bot.action(Language.ES, handleSetLanguageAction);

bot.action(Currency.USD_CURRENCY_CODE.toLowerCase(), handleSetCurrencyAction);
bot.action(Currency.RUB_CURRENCY_CODE.toLowerCase(), handleSetCurrencyAction);
bot.action(Currency.EUR_CURRENCY_CODE.toLowerCase(), handleSetCurrencyAction);

bot.action(Action.CANCEL, handleCancel);

bot.on('text', handlePriceList);

bot
  .launch()
  .then(() => console.log('The iknowtheprice bot started!'));

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);
