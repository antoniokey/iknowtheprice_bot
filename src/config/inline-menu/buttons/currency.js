const { Markup } = require('telegraf');
const { Currency } = require('../../../enum');

const USD_CURRENCY_BUTTON = Markup.callbackButton(Currency.USD_CURRENCY_CODE, Currency.USD_CURRENCY_CODE.toLowerCase());
const RUB_CURRENCY_BUTTON = Markup.callbackButton(Currency.RUB_CURRENCY_CODE, Currency.RUB_CURRENCY_CODE.toLowerCase());
const EUR_CURRENCY_BUTTON = Markup.callbackButton(Currency.EUR_CURRENCY_CODE, Currency.EUR_CURRENCY_CODE.toLowerCase());

module.exports = [USD_CURRENCY_BUTTON, RUB_CURRENCY_BUTTON, EUR_CURRENCY_BUTTON];
