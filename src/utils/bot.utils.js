const cheerio = require('cheerio');
const translate = require('translatte');
const BotError = require('../config/error-handler');
const { getChosenCurrencySign, getCurrencyRate, getChosenCurrencyCode } = require('./currency.utils');
const {
  HEADERS_SELECTOR,
  LIST_SELECTOR,
  NEW_LINE_SYMBOLS,
  AVERAGE_PRICE,
  UNSUTABLE_TRANSLATE_SYMBOLS,
  PERMITTED_COMMANDS,
  USD_CURRENCY_CODE
} = require('../constants/constants');

const removeUnnecessaryCharactersFromPrice = price => {
  return price.match(/[0-9]+.[0-9]+/).join('');
};

const removeNewLinesTralingLeadingSpaces = data => {
  return data.replace(NEW_LINE_SYMBOLS, '').trim();
};

const prepareTranslatedData = translatedData => {
  const preparedTranslatedData = translatedData.match(UNSUTABLE_TRANSLATE_SYMBOLS)[0];

  return preparedTranslatedData.toLowerCase();
};

const getAveragePriceForTwoPersons = averagePriceText => {
  const deafultDigitsAfterDot = '00';
  const averagePriceParts = averagePriceText.match(/[0-9]+/g);

  return `${averagePriceParts[0]}.${averagePriceParts[1] ? averagePriceParts[1] : deafultDigitsAfterDot}`;
};

const getAveragePriceForPersons = (averagePriceForTwoPersons, amountOfPersons) => {
  const averagePriceForOnePerson = (averagePriceForTwoPersons / 2).toFixed(2);
  const averagePriceForPersons = (averagePriceForOnePerson * amountOfPersons).toFixed(2);

  return +averagePriceForPersons;
};

const getPreparedAveragePriceResponse = (averagePriceText, averagePriceForPersons, currencyRate, priceListCurrencyCode, averagePriceReplacementTextPart) => {
  let preparedAveragePriceResponse;

  preparedAveragePriceResponse = averagePriceText.replace(averagePriceReplacementTextPart, '');
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(/[0-9]+.[0-9]+/, (averagePriceForPersons * currencyRate).toFixed(2));
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(/ {2,}/, ' ');
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(USD_CURRENCY_CODE, priceListCurrencyCode);

  return preparedAveragePriceResponse;
};

const getHeadersData = ($, i18n) => {
  const headers = [];

  $(HEADERS_SELECTOR).each((i, elem) => {
    headers.push({ text: $(elem).text().trim() });
  });

  if (headers.length) {
    return headers;
  } else {
    throw new BotError(i18n.t('parsingPageError'), true);
  }
};

const getListData = ($, i18n, session) => {
  const list = [];

  $(LIST_SELECTOR).each((i, goodWrapperElement) => {
    const options = {};
    const prevTag = $(goodWrapperElement).prev()[0].tagName;

    $(goodWrapperElement).children('.col-good-title').each((i, goodTitleElement) => {
      options.goodTitle = removeNewLinesTralingLeadingSpaces($(goodTitleElement).text());
    });

    $(goodWrapperElement)
      .children('.col-price')
      .each((index, goodPriceElement) => {
        let priceResult;

        priceResult = $(goodPriceElement).text();
        priceResult = removeNewLinesTralingLeadingSpaces(priceResult);
        priceResult = removeUnnecessaryCharactersFromPrice(priceResult);
        priceResult = priceResult.split(',').join('');

        options.goodPrice = priceResult;
        options.goodPriceCurrency = getChosenCurrencySign(session.priceListCurrencyCode);
      });
    
    if (prevTag === 'h3') {
      list.push([options]);
    } else {
      list[list.length - 1].push(options);
    }
  });

  if (list.length) {
    return list;
  } else {
    throw new BotError(i18n.t('parsingPageError'), true);
  }
};

const getPriceList = async (page, i18n, session) => {
  const $ = cheerio.load(page);
  const headers = getHeadersData($, i18n);
  const list = getListData($, i18n, session);
  const currencyRate = await getCurrencyRate(session.priceListCurrencyCode, getChosenCurrencyCode(i18n.languageCode));
  const priceList = [];

  headers.forEach((header, headerIndex) => {
    const headerTitle = `<b>${header.text}:</b>\n\n`;
    const goodPrice = list[headerIndex].map(good => {
      const { goodTitle, goodPrice, goodPriceCurrency } = good;
      const convertedPrice = (goodPrice * currencyRate).toFixed(2);

      return `${goodTitle} - ${convertedPrice}${goodPriceCurrency}`;
    });

    priceList.push(headerTitle + goodPrice.join('\n'));
  });

  return priceList;
};

const getPageUrl = (pageUrl, language, country, city, state) => {
  let url;

  if (language === 'en') {
    url = `${pageUrl}/country/${country}/city/${city}/cost-of-living`;
  } else {
    const protocol = pageUrl.slice(0, 8);
    const domain = pageUrl.slice(8);

    url = `${protocol}${language}.${domain}/country/${country}/city/${city}/cost-of-living`;
  }

  if (state) {
    const urlWithoutEndPart = url.split('/cost-of-living')[0];

    url = `${urlWithoutEndPart}-${state}/cost-of-living`;
  }

  return url;
};

const preparePlaceInformation = async (incommingPlace, i18n) => {
  const incorrectPlaceName = i18n.t('incorrectPlaceName');
  const [country, city, state] = incommingPlace.split(',').map(value => value.trim());

  if (!country || !city) {
    throw new BotError(incorrectPlaceName, true);
  }

  const translatedCountry = await translate(country, { to: 'en' });
  const translatedCity = await translate(city, { to: 'en' });

  return {
    country: prepareTranslatedData(translatedCountry.text),
    city: prepareTranslatedData(translatedCity.text),
    state: state ? state.toLowerCase() : null
  };
};

const getAveragePrice = async (session, page, amountOfPersons, averagePriceReplacementTextPart) => {
  const currencyRate = await getCurrencyRate(session.priceListCurrencyCode, USD_CURRENCY_CODE);
  const $ = cheerio.load(page);
  const averagePriceText = `<b>${removeNewLinesTralingLeadingSpaces($($(AVERAGE_PRICE)[0]).text())}</b>`;
  const averagePriceForTwoPersons = getAveragePriceForTwoPersons(averagePriceText);
  const averagePriceForPersons = getAveragePriceForPersons(averagePriceForTwoPersons, amountOfPersons);
  const averagePriceResponse = getPreparedAveragePriceResponse(averagePriceText, averagePriceForPersons, currencyRate, session.priceListCurrencyCode, averagePriceReplacementTextPart);

  return averagePriceResponse;
};

const replyWithHTML = async (ctx, data) => {
  ctx.replyWithHTML(data);
};

const isBotCommand = incommingMessage => {
  return incommingMessage.startsWith('/') && !PERMITTED_COMMANDS.includes(incommingMessage);
};

const interactionAfterAnAction = async (ctx, actionMessage) => {
  ctx.reply(actionMessage);
};

const showPriceListMessage = async ctx => {
  const { reply, i18n } = ctx;
  const getPriceListMessage = i18n.t('getPriceListMessage');

  reply(getPriceListMessage);
};

module.exports = {
  getPriceList,
  getPageUrl,
  preparePlaceInformation,
  getAveragePrice,
  replyWithHTML,
  prepareTranslatedData,
  getAveragePriceForTwoPersons,
  removeNewLinesTralingLeadingSpaces,
  getAveragePriceForPersons,
  getPreparedAveragePriceResponse,
  isBotCommand,
  interactionAfterAnAction,
  showPriceListMessage
};
