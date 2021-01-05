const cheerio = require('cheerio');
const translate = require('translatte');
const BotError = require('../config/error-handler');
const { Currency, Regex, Selector, Language } = require('../enum');
const permittedCommands = require('../constants/permitted-commands');
const { getChosenCurrencySign, getCurrencyRate, getChosenCurrencyCode } = require('./currency');

const removeUnnecessaryCharactersFromPrice = price => {
  return price.match(/[0-9]+.[0-9]+/).join('');
};

const removeNewLinesTralingLeadingSpaces = data => {
  return data.replace(Regex.NEW_LINE_SYMBOLS, '').trim();
};

const prepareTranslatedData = translatedData => {
  const preparedTranslatedData = translatedData.match(Regex.UNSUTABLE_TRANSLATE_SYMBOLS)[0];

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
  preparedAveragePriceResponse = preparedAveragePriceResponse.replace(Currency.USD_CURRENCY_CODE, priceListCurrencyCode);

  return preparedAveragePriceResponse;
};

const getHeadersData = (parsingPageError, $) => {
  const headers = [];

  $(Selector.HEADERS_SELECTOR).each((i, elem) => {
    headers.push({ text: $(elem).text().trim() });
  });

  if (headers.length) {
    return headers;
  } else {
    throw new BotError(parsingPageError, true);
  }
};

const getListData = (parsingPageError, $, session) => {
  const list = [];

  $(Selector.LIST_SELECTOR).each((i, goodWrapperElement) => {
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
    throw new BotError(parsingPageError, true);
  }
};

const getPriceList = async (page, i18n, session) => {
  const $ = cheerio.load(page);
  const headers = getHeadersData(i18n.t('parsingPageError'), $);
  const list = getListData(i18n.t('parsingPageError'), $, session);
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

  const translatedCountry = await translate(country, { to: Language.EN });
  const translatedCity = await translate(city, { to: Language.EN });

  return {
    country: prepareTranslatedData(translatedCountry.text),
    city: prepareTranslatedData(translatedCity.text),
    state: state ? state.toLowerCase() : null
  };
};

const getAveragePrice = async (session, page, averagePriceReplacementTextPart) => {
  const { priceListCurrencyCode, amountOfPersons } = session;
  const currencyRate = await getCurrencyRate(session.priceListCurrencyCode, Currency.USD_CURRENCY_CODE);
  const $ = cheerio.load(page);
  const averagePriceText = `<b>${removeNewLinesTralingLeadingSpaces($($(Selector.AVERAGE_PRICE)[0]).text())}</b>`;
  const averagePriceForTwoPersons = getAveragePriceForTwoPersons(averagePriceText);
  const averagePriceForPersons = getAveragePriceForPersons(averagePriceForTwoPersons, amountOfPersons);
  const averagePriceResponse = getPreparedAveragePriceResponse(averagePriceText, averagePriceForPersons, currencyRate, priceListCurrencyCode, averagePriceReplacementTextPart);

  return averagePriceResponse;
};

const isBotCommand = incommingMessage => {
  return incommingMessage.startsWith('/') && !permittedCommands.includes(incommingMessage);
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
  prepareTranslatedData,
  getAveragePriceForTwoPersons,
  removeNewLinesTralingLeadingSpaces,
  getAveragePriceForPersons,
  getPreparedAveragePriceResponse,
  isBotCommand,
  interactionAfterAnAction,
  showPriceListMessage
};
