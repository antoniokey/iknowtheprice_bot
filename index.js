require('dotenv').config();

const { Telegraf, session } = require('telegraf');
const { i18n } = require('./src/config/i18n');
const {
  handleStart,
  handleGetLanguage,
  handleGetCurrency,
  handleSetLanguage,
  handleSetCurrency,
  handleHelp,
  handleSetLanguageAction,
  handleSetCurrencyAction,
  handleText,
  handleGetAmountOfPersons,
  handleSetAmountOfPersons,
  handleCancel
} = require('./src/handlers/bot.handlers');
const { handleError } = require('./src/utils/error.utils');

const API_TOKEN = process.env.API_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com';

const bot = new Telegraf(API_TOKEN);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

bot.use(session());
bot.use(i18n.middleware());

bot.hears('/start', handleStart);
bot.hears('/getlanguage', handleGetLanguage);
bot.hears('/getcurrency', handleGetCurrency);
bot.hears('/getamountofpersons', handleGetAmountOfPersons);
bot.hears('/setlanguage', handleSetLanguage);
bot.hears('/setcurrency', handleSetCurrency);
bot.hears('/setamountofpersons', handleSetAmountOfPersons);
bot.hears('/help', handleHelp);

bot.action('ru', handleSetLanguageAction);
bot.action('en', handleSetLanguageAction);
bot.action('es', handleSetLanguageAction);

bot.action('usd', handleSetCurrencyAction);
bot.action('rub', handleSetCurrencyAction);
bot.action('eur', handleSetCurrencyAction);

bot.action('cancel', handleCancel);

bot.on('text', handleText);

bot
  .launch()
  .then(() => console.log('The iknowtheprice bot started!'));

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);
