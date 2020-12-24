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

const getAveragePriceForTwoPersons = averagePriceText => {
  const averagePriceParts = averagePriceText.match(/[0-9]+/g);

  return `${averagePriceParts[0]}.${averagePriceParts[1] ? averagePriceParts[1] : 00}`;
};

const getAveragePriceForPersons = (averagePriceForTwoPersons, amountOfPersons) => {
  const averagePriceForOnePerson = (averagePriceForTwoPersons / 2).toFixed(2);
  const averagePriceForPersons = averagePriceForOnePerson * amountOfPersons;

  return averagePriceForPersons;
};

const getPreparedAveragePriceRespponse = (averagePriceText, averagePriceForPersons, averagePriceReplacementTextPart) => {
  let preparedAveragePriceResponse;

  preparedAveragePriceResponse = averagePriceText.replace(averagePriceReplacementTextPart, '');
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(/[0-9]+.[0-9]+/, averagePriceForPersons);
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(/ {2,}/, ' ');

  return preparedAveragePriceResponse;
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

const getInformationForAPlace = async (incommingPlace, i18n, sessionAmountOfPersons) => {
  const incorrectPlaceName = i18n.t('incorrectPlaceName');
  const [country, city, incommingAmountOfPersons] = incommingPlace.split(',').map(value => value.trim());
  let amountOfPersons = sessionAmountOfPersons;

  if (!country || !city) {
    throw new Error(incorrectPlaceName);
  }
  if (incommingAmountOfPersons) {
    amountOfPersons = incommingAmountOfPersons;
  }

  const translatedCountry = await translate(country, { to: 'en' });
  const translatedCity = await translate(city, { to: 'en' });

  return {
    country: prepareTranslatedData(translatedCountry.text),
    city: prepareTranslatedData(translatedCity.text),
    amountOfPersons
  };
};

const getAveragePrice = (page, amountOfPersons, averagePriceReplacementTextPart) => {
  const $ = cheerio.load(page);
  const averagePriceText = `<b>${removeNewLinesAndSpaces($($(AVERAGE_PRICE)[0]).text())}</b>`;
  const averagePriceForTwoPersons = getAveragePriceForTwoPersons(averagePriceText);
  const averagePriceForPersons = getAveragePriceForPersons(averagePriceForTwoPersons, amountOfPersons);
  const averagePriceResponse = getPreparedAveragePriceRespponse(averagePriceText, averagePriceForPersons, averagePriceReplacementTextPart);

  return averagePriceResponse;
};

const replyWithHTML = async (ctx, data) => {
  ctx.replyWithHTML(data);
};

module.exports = { getPriceList, getPageUrl, getInformationForAPlace, getAveragePrice, replyWithHTML };
