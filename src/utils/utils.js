const cheerio = require('cheerio');
const translate = require('translatte');
const {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  NEW_LINE_SYMBOLS,
  AVERAGE_PRICE,
  UNSUTABLE_TRANSLATE_SYMBOLS
} = require('../constants/constants');

const removeNewLinesAndSpaces = data => {
  return data.replace(NEW_LINE_SYMBOLS, '').trim();
};

const prepareTranslatedData = translatedData => {
  const preparedTranslatedData = translatedData.match(UNSUTABLE_TRANSLATE_SYMBOLS)[0];

  return  preparedTranslatedData;
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

    url = `${protocol}${language}.${domain}/country/${country}/city/${city}/cost-of-living`;
  }

  return url;
};

const getCountryAndCity = async (incommingPlace, i18n) => {
  const incorrectPlaceName = i18n.t('incorrectPlaceName');
  const [country, city] = incommingPlace.split(',').map(value => value.trim());
  if (!country || !city) {
    throw new Error(incorrectPlaceName);
  }

  const translatedCountry = await translate(country, { to: 'en' });
  const translatedCity = await translate(city, { to: 'en' });

  return { country: prepareTranslatedData(translatedCountry.text), city: prepareTranslatedData(translatedCity.text) };
};

const getAveragePrice = page => {
  const $ = cheerio.load(page);
  const averagePrice = `<b>${removeNewLinesAndSpaces($($(AVERAGE_PRICE)[0]).text())}</b>`;

  return averagePrice;
};

const replyWithHTML = async (ctx, data) => {
  ctx.replyWithHTML(data);
};

module.exports = { getPriceList, getPageUrl, getCountryAndCity, getAveragePrice, replyWithHTML };
