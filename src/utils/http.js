const axios = require('axios');

const fetchPage = url => {
  return axios.get(url);
};

const fetchCurrencyRate = url => {
  return axios.get(
    url,
    {
      headers: {
        'apikey': process.env.CURRENCY_CONVERTER_API_KEY,
      },
    },
  );
};

module.exports = { fetchCurrencyRate, fetchPage };
