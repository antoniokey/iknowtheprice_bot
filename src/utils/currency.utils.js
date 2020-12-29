const axios = require('axios');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const {
  CURRENCY_CONVERTER_VALUE_SELECTOR,
  USD_CURRENCY_CODE,
  RUB_CURRENCY_CODE,
  EUR_CURRENCY_CODE,
  USD_CURRENCY_SIGN,
  RUB_CURRENCY_SIGN,
  EUR_CURRENCY_SIGN
} = require('../constants/constants');

const getCurrencyRatePosition = toCurrencyCode => {
  switch (toCurrencyCode) {
    case USD_CURRENCY_CODE: {
      return 0;
    }
    case EUR_CURRENCY_CODE: {
      return 1;
    }
    case RUB_CURRENCY_CODE: {
      return 3;
    }
  }
};

const getCurrencyConverterUrl = (pageUrl, fromCurrencyCode, priceValue) => {
  return `${pageUrl}?val_nbrb=${fromCurrencyCode.toLowerCase()}-${priceValue}`;
};

const getPriceListCurrencyCode = language => {
  switch (language) {
    case 'en': {
      return USD_CURRENCY_CODE;
    }
    case 'ru': {
      return RUB_CURRENCY_CODE;
    }
    case 'es': {
      return EUR_CURRENCY_CODE;
    }
  }
};

const getCurrentCurrencySign = currencyCode => {
  switch (currencyCode) {
    case USD_CURRENCY_CODE: {
      return USD_CURRENCY_SIGN;
    }
    case RUB_CURRENCY_CODE: {
      return RUB_CURRENCY_SIGN;
    }
    case EUR_CURRENCY_CODE: {
      return EUR_CURRENCY_SIGN;
    }
  }
};

const getConvertingCurrencyValue = async (language, currentCurrencyCode, priceValue) => {
  const nightmare = new Nightmare();
  const priceListCurrencyCode = getPriceListCurrencyCode(language);
  if (priceListCurrencyCode === currentCurrencyCode) {
    return priceValue;
  }
  const currencyRatePosition = getCurrencyRatePosition(currentCurrencyCode);
  const currencyConverterUrl = getCurrencyConverterUrl(process.env.CURRENCY_CONVERTER_PAGE, priceListCurrencyCode, priceValue);

  return nightmare
    .goto(currencyConverterUrl)
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
      const $ = cheerio.load(response, { decodeEntities: false });
      const currencyValue = $($(CURRENCY_CONVERTER_VALUE_SELECTOR)[currencyRatePosition]).val();

      return Number(currencyValue).toFixed(2);
    });
};

module.exports = { getConvertingCurrencyValue, getCurrentCurrencySign };
