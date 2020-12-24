const {
  removeNewLinesTralingLeadingSpaces,
  prepareTranslatedData,
  getAveragePriceForTwoPersons,
  getAveragePriceForPersons,
  getPreparedAveragePriceResponse,
  getPageUrl,
  getInformationForAPlace
} = require('../../src/utils/utils');

describe('Utils', () => {

  it('removeNewLinesAndSpaces should remove all spaces and new line characters from a string', () => {
    const string = '   This is a testing\n string   ';
    const expectedString = 'This is a testing string';
    const actualString = removeNewLinesTralingLeadingSpaces(string);

    expect(actualString).toBe(expectedString);
  });

  it('prepareTranslatedData should return string with letters or letters and dash', () => {
    const stringWithoutDash = 'WithoutDash';
    const stringWithDash = 'San-Francisco';
    const stringWithOtherSymbols = 'OtherSymbols!!!';
    const expectedStringWithoutDash = 'withoutdash';
    const expectedStringWithDash = 'san-francisco';
    const expectedStringWithOtherSymbols = 'othersymbols';
    const preparedStringWithoutDash = prepareTranslatedData(stringWithoutDash);
    const preparedStringWithDash = prepareTranslatedData(stringWithDash);
    const preparedStringWithOtherSymbols = prepareTranslatedData(stringWithOtherSymbols);

    expect(expectedStringWithoutDash).toBe(preparedStringWithoutDash);
    expect(expectedStringWithDash).toBe(preparedStringWithDash);
    expect(expectedStringWithOtherSymbols).toBe(preparedStringWithOtherSymbols);
  });

  it('getAveragePriceForTwoPersons should return string with price in format like 10.10 if there is number with decimal in a text string', () => {
    const text = 'Testing 10.10 string!';
    const expectedResult = '10.10';
    const actualResult = getAveragePriceForTwoPersons(text);

    expect(actualResult).toBe(expectedResult);
  });

  it('getAveragePriceForTwoPersons should return string with price in format like 10.00 if there is number without decimal in a text string', () => {
    const text = 'Testing 10 string!';
    const expectedResult = '10.00';
    const actualResult = getAveragePriceForTwoPersons(text);

    expect(actualResult).toBe(expectedResult);
  });

  it('getAveragePriceForPersons should return number depending on amount of persons', () => {
    const amountOfPersons = 5;
    const priceForAPerson = 100;
    const priceForTwoPersons = priceForAPerson * 2;
    const expectedResult = (priceForAPerson * amountOfPersons).toFixed(2);
    const actualResult = getAveragePriceForPersons(priceForTwoPersons, amountOfPersons);

    expect(actualResult).toBe(+expectedResult);
  });

  it('getPreparedAveragePriceResponse should remove unsutable parts of text and leave space on that place', () => {
    const price = 200.00;
    const textEn = `for two person   ${price}`;
    const textRu = `для двух человек   ${price}`;
    const textEs = `para dos personas   ${price}`;
    const averagePrice = 400;
    const averagePriceReplacementTextPartEn = 'for two person';
    const averagePriceReplacementTextPartRu = 'для двух человек';
    const averagePriceReplacementTextPartEs = 'para dos personas';
    const expectedResultEn = ` ${averagePrice}`;
    const expectedResultRu = ` ${averagePrice}`;
    const expectedResultEs = ` ${averagePrice}`;
    const actualResultEn = getPreparedAveragePriceResponse(textEn, averagePrice, averagePriceReplacementTextPartEn);
    const actualResultRu = getPreparedAveragePriceResponse(textRu, averagePrice, averagePriceReplacementTextPartRu);
    const actualResultEs = getPreparedAveragePriceResponse(textEs, averagePrice, averagePriceReplacementTextPartEs);

    expect(actualResultEn).toBe(expectedResultEn);
    expect(actualResultRu).toBe(expectedResultRu);
    expect(actualResultEs).toBe(expectedResultEs);
  });

  it('getPageUrl should return page url delending on language', () => {
    const pageUrlProtocol = 'https://';
    const pageUrlDomain = 'test.com';
    const county = 'Country';
    const city = 'City';
    const en = 'en';
    const ru = 'ru';
    const es = 'es';
    const expectedResultEn = `${pageUrlProtocol}${pageUrlDomain}/country/${county}/city/${city}/cost-of-living`;
    const expectedResultRu = `${pageUrlProtocol}ru.${pageUrlDomain}/country/${county}/city/${city}/cost-of-living`;
    const expectedResultEs = `${pageUrlProtocol}es.${pageUrlDomain}/country/${county}/city/${city}/cost-of-living`;
    const actualResultEn = getPageUrl(pageUrlProtocol + pageUrlDomain, en, county, city);
    const actualResultRu = getPageUrl(pageUrlProtocol + pageUrlDomain, ru, county, city);
    const actualResultEs = getPageUrl(pageUrlProtocol + pageUrlDomain, es, county, city);

    expect(expectedResultEn).toBe(actualResultEn);
    expect(expectedResultRu).toBe(actualResultRu);
    expect(expectedResultEs).toBe(actualResultEs);
  });

  it('getInformationForAPlace should return object with country, city and amount of persons', async done => {
    const i18n = {
      incorrectPlaceName_en: '',
      incorrectPlaceName_ru: '',
      incorrectPlaceName_es: '',
      language: '',
      t(label) {
        return this[`${label}_${this.language}`];
      }
    };
    const languagesData = {
      en: { country: 'Country', city: 'City' },
      ru: { country: 'Страна', city: 'Город' },
      es: { country: 'País', city: 'Ciudad' },
    }
    const sessionAmountOfPersons = 3;
    const expectedResultEn = {
      country: languagesData.en.country.toLowerCase(),
      city: languagesData.en.city.toLowerCase(),
      amountOfPersons: sessionAmountOfPersons
    };
    const expectedResultRu = {
      country: 'side', // telegraf-i18n does not correctrly translate russian word - country
      city: languagesData.en.city.toLowerCase(),
      amountOfPersons: sessionAmountOfPersons
    };
    const expectedResultEs = {
      country: languagesData.en.country.toLowerCase(),
      city: languagesData.en.city.toLowerCase(),
      amountOfPersons: sessionAmountOfPersons
    };

    i18n.language = 'en';
    const actualResultEn = await getInformationForAPlace(`${languagesData.en.country}, ${languagesData.en.city}`, i18n, sessionAmountOfPersons);

    i18n.language = 'ru';
    const actualResultRu = await getInformationForAPlace(`${languagesData.ru.country}, ${languagesData.ru.city}`, i18n, sessionAmountOfPersons);

    i18n.language = 'es';
    const actualResultEs = await getInformationForAPlace(`${languagesData.es.country}, ${languagesData.es.city}`, i18n, sessionAmountOfPersons);

    expect(actualResultEn).toEqual(expectedResultEn);
    expect(actualResultRu).toEqual(expectedResultRu);
    expect(actualResultEs).toEqual(expectedResultEs);

    done();
  });

});
