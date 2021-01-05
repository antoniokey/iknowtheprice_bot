const { Markup } = require('telegraf');
const { USD_CURRENCY_CODE, RUB_CURRENCY_CODE, EUR_CURRENCY_CODE } = require('../../../constants/constants');

const USD_CURRENCY_BUTTON = Markup.callbackButton(USD_CURRENCY_CODE, 'usd');
const RUB_CURRENCY_BUTTON = Markup.callbackButton(RUB_CURRENCY_CODE, 'rub');
const EUR_CURRENCY_BUTTON = Markup.callbackButton(EUR_CURRENCY_CODE, 'eur');

module.exports = [USD_CURRENCY_BUTTON, RUB_CURRENCY_BUTTON, EUR_CURRENCY_BUTTON];
