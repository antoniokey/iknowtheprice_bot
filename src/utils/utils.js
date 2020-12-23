const cheerio = require('cheerio');
const translate = require('translate');
const { HEADERS_SELECTOR, LIST_SELECTOR, NEW_LINE_SYMBOLS } = require('../constants/constants');

const removeNewLinesAndSpaces = data => {
  return data.replace(NEW_LINE_SYMBOLS, '').trim();
};

const getHeadersData = $ => {
  try {
    const headers = [];

    $(HEADERS_SELECTOR).each((i, elem) => {
      headers.push({ text: $(elem).text().trim() });
    });

    return headers;
  } catch(err) {
    console.log(err);
  }
};

const getListData = $ => {
  try {
    const list = [];

    $(LIST_SELECTOR).each((i, elem) => {
      const options = {};
      const prevTag = $(elem).prev()[0].tagName;

      $(elem).children('.col-good-title').each((i, elem) => {
        options.goodTitle = removeNewLinesAndSpaces($(elem).text());
      });

      $(elem)
        .children('.col-price')
        .children('span')
        .each((index, elem) => {
          if (index === 0) {
            options.goodPrice = removeNewLinesAndSpaces($(elem).text());
          } else {
            options.goodPriceCurrency = removeNewLinesAndSpaces($(elem).text());
          }
        });
      
      if (prevTag === 'h3') {
        list.push([options]);
      } else {
        list[list.length - 1].push(options);
      }
    });

    return list;
  } catch(err) {
    console.log(err);
  }
};

const getPriceList = page => {
  try {
    const $ = cheerio.load(page);
    const headers = getHeadersData($);
    const list = getListData($);
    const priceList = [];

    headers.forEach((header, index) => {
      const goodTitle = `<b>${header.text}:</b>\n\n`;
      const goodPrice = list[index].map(good => `${good.goodTitle} - ${good.goodPrice}${good.goodPriceCurrency}`).join('\n');

      priceList.push(goodTitle + goodPrice);
    });

    return priceList;
  } catch(err) {
    console.log(err);
  }
};

const getPageUrl = (language, country, city) => {
  const pageUrl = process.env.PAGE_URL;
  let url;

  if (language === 'en') {
    url = `${pageUrl}/country/${country}/city/${city}/cost-of-living`;
  } else {
    const protocol = pageUrl.slice(0, 8);
    const domain = pageUrl.slice(8);

    url = `${protocol}${language}.${domain}/${country}/city/${city}/cost-of-living`;
  }

  return url;
};

const getCountryAndCity = async (incommingPlace, language) => {
  const [country, city] = incommingPlace.split(', ').map(value => value.toLowerCase());
  // const translatedCountry = await translate(country, { from: language, to: 'en', engine: '' });
  // const translatedCity = await translate(city, { from: language, to: 'en' });

  return { country, city };
};

module.exports = { getPriceList, getPageUrl, getCountryAndCity };
