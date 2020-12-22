require('dotenv').config();

const { Telegraf, session } = require('telegraf');
const { handleStart, handleLanguage, handleHelp, handleLanguageAction, handleText } = require('./handlers/handlers');
const { handleInitialSetupMiddleware } = require('./middlewares/middlewares');
const { preparePlacesFiles } = require('./utils/utils');

const bot = new Telegraf(process.env.BOT_TOKEN);

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
  .then(preparePlacesFiles);
