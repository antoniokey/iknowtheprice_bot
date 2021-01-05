const axios = require('axios');

const fetchPage = url => {
  return axios.get(url);
};

const fetchCurrencyRate = url => {
  return axios.get(url);
};

module.exports = { fetchCurrencyRate, fetchPage };
