require('dotenv').config();

const axios = require('axios');
const { Telegraf, Extra, Markup, session } = require('telegraf');
const { getPriceList, preparePlacesFiles, handleLanguageAction } = require('./utils/utils');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.hears('/start', ctx => {
  const languageQuestion = `What language do you want to use? Choose the appropriate language!`;
  const languageOptions = [Markup.callbackButton('EN', 'en'), Markup.callbackButton('RU', 'ru')];

  ctx.reply(languageQuestion, Extra.HTML().markup(Markup.inlineKeyboard(languageOptions)));
});

bot.action('en', handleLanguageAction);
bot.action('ru', handleLanguageAction);

bot.on('text', async ctx => {
  try {
    const places = require(`./places/places_${ctx.session.botLanguage}.json`);
    const incomingText = ctx.message.text;
    const incomingPlace = incomingText[0].toUpperCase() + incomingText.slice(1);

    ctx.reply(`Now the bot is getting all the price in ${incomingPlace}...`);

    const url = places.find(place => place.title === incomingPlace).url;
    const webpage = await axios.get(url);

    ctx.replyWithHTML(getPriceList(webpage.data));
  } catch(err) {
    console.log(err.message);
  }
});

bot
  .launch()
  .then(preparePlacesFiles);
