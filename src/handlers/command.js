const { Currency } = require('../enum');
const { showMainMenu } = require('../utils/menu');

const handleStart = async ctx => {
  const { session, i18n, reply } = ctx;

  i18n.languageCode = 'ru';

  const welcomeMessage = i18n.t('welcomeMessage');

  session.amountOfPersons = 1;
  session.priceListCurrencyCode = Currency.USD_CURRENCY_CODE;
  session.isPriceListMode = true;

  await reply(welcomeMessage);
  await showMainMenu(ctx);
};

const handleHelp = async ctx => {
  await showMainMenu(ctx);
};

module.exports = { handleStart, handleHelp };
