const { Language, Currency } = require('../enum');
const { fetchCurrencyRate } = require('./http');

const getChosenCurrencyCode = language => {
  switch (language) {
    case Language.EN: {
      return Currency.USD_CURRENCY_CODE;
    }
    case Language.RU: {
      return Currency.RUB_CURRENCY_CODE;
    }
    case Language.ES: {
      return Currency.EUR_CURRENCY_CODE;
    }
  }
};

const getChosenCurrencySign = currencyCode => {
  switch (currencyCode) {
    case Currency.USD_CURRENCY_CODE: {
      return Currency.USD_CURRENCY_SIGN;
    }
    case Currency.RUB_CURRENCY_CODE: {
      return Currency.RUB_CURRENCY_SIGN;
    }
    case Currency.EUR_CURRENCY_CODE: {
      return Currency.EUR_CURRENCY_SIGN;
    }
  }
};

const getCurrencyRate = async (toCurrencyCode, fromCurrencyCode) => {
  const coverterApiUrl = `${process.env.CURRENCY_CONVERTER_API}/latest`;
  const coverterApiUrlQuery = `?base=${fromCurrencyCode}&symbols=${toCurrencyCode}`;
  const { data: { rates } } = await fetchCurrencyRate(`${coverterApiUrl}${coverterApiUrlQuery}`);

  return rates[toCurrencyCode];
};

module.exports = { getChosenCurrencyCode, getChosenCurrencySign, getCurrencyRate };
