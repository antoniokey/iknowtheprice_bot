const { MainMenu } = require('../config/inline-menu');
const { Currency } = require('../enum');
const { showPriceListMessage } = require('../utils/price-list');

const handleStart = async ctx => {
  const { session, i18n, reply } = ctx;

  i18n.languageCode = 'ru';

  const welcomeMessage = i18n.t('welcomeMessage');

  session.amountOfPersons = 1;
  session.priceListCurrencyCode = Currency.USD_CURRENCY_CODE;
  session.isPriceListMode = true;

  await reply(welcomeMessage);
  await showPriceListMessage(ctx, MainMenu.getMainMenu(i18n));
};

const handleHelp = async ctx => {
  await showPriceListMessage(ctx, MainMenu.getMainMenu(i18n));
};

module.exports = { handleStart, handleHelp };
