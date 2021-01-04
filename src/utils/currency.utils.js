const axios = require('axios');
const {
  USD_CURRENCY_CODE,
  RUB_CURRENCY_CODE,
  EUR_CURRENCY_CODE,
  USD_CURRENCY_SIGN,
  RUB_CURRENCY_SIGN,
  EUR_CURRENCY_SIGN
} = require('../constants/constants');

const getChoosenCurrencyCode = language => {
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

const getChoosenCurrencySign = currencyCode => {
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

const getCurrencyRate = async (toCurrencyCode, fromCurrencyCode) => {
  const coverterApiUrl = `${process.env.CURRENCY_CONVERTER_API}`;
  const coverterApiUrlQuery = `?apiKey=${process.env.CURRENCY_CONVERTER_API_KEY}&q=${fromCurrencyCode}_${toCurrencyCode}&compact=ultra`;
  const { data: currencyRate } = await axios.get(coverterApiUrl + coverterApiUrlQuery);

  return currencyRate[`${fromCurrencyCode}_${toCurrencyCode}`];
};

module.exports = { getChoosenCurrencyCode, getChoosenCurrencySign, getCurrencyRate };
