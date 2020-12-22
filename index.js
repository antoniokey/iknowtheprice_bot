require('dotenv').config();

const { Telegraf, session } = require('telegraf');
const { handleStart, handleLanguage, handleHelp, handleLanguageAction, handleText } = require('./handlers/handlers');
const { handleInitialSetupMiddleware } = require('./middlewares/middlewares');
const { preparePlacesFiles } = require('./utils/utils');

const API_TOKEN = process.env.API_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com';

const bot = new Telegraf(API_TOKEN);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

bot.use(session());
bot.use(handleInitialSetupMiddleware);

bot.hears('/start', handleStart);
bot.hears('/language', handleLanguage);
bot.hears('/help', handleHelp);

bot.action('en', handleLanguageAction);
bot.action('ru', handleLanguageAction);

bot.on('text', handleText);

bot.start(() => console.log('Bot has been started successfully!'));

bot
  .launch()
  .then(() => console.log('The iknowtheprice bot started!'))
  .then(preparePlacesFiles);
