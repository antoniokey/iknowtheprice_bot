const axios = require('axios');
const cheerio = require('cheerio');
const {
  CURRENCY_CONVERTER_VALUE_SELECTOR,
  USD_CURRENCY_CODE,
  RUB_CURRENCY_CODE,
  EUR_CURRENCY_CODE,
  USD_CURRENCY_SIGN,
  RUB_CURRENCY_SIGN,
  EUR_CURRENCY_SIGN
} = require('../constants/constants');

const getCurrencyConverterUrl = (pageUrl, fromCurrencyCode, toCurrencyCode, priceValue) => {
  return `${pageUrl}?from=${fromCurrencyCode}&to=${toCurrencyCode}&sum=${priceValue}&date=&rate=forex`;
};

const getCurrentCurrencyCode = language => {
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

const getConvertingCurrencyValue = async (language, priceValue) => {
  const currentCurrencyCode = getCurrentCurrencyCode(language);
  if (currentCurrencyCode === USD_CURRENCY_CODE) {
    return priceValue;
  }
  const page = await axios.get(getCurrencyConverterUrl(process.env.CURRENCY_CONVERTER_PAGE, currentCurrencyCode, USD_CURRENCY_CODE, priceValue));
  const $ = cheerio.load(page, { decodeEntities: false, normalizeWhitespace: true });
  const currencyValue = $(CURRENCY_CONVERTER_VALUE_SELECTOR);

  return currencyValue;
};

module.exports = { getConvertingCurrencyValue, getCurrentCurrencySign };
