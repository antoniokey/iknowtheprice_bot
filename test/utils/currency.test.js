const { Language, Currency } = require('../../src/enum');
const { getChosenCurrencyCode, getChosenCurrencySign } = require('../../src/utils/currency');

describe('Currency Utils', () => {

  it('getChosenCurrencyCode should return correct currency code depending on language', () => {
    const ruLanguage = Language.RU;
    const enLanguage = Language.EN;
    const esLanguage = Language.ES;

    expect(getChosenCurrencyCode(ruLanguage)).toBe(Currency.RUB_CURRENCY_CODE);
    expect(getChosenCurrencyCode(enLanguage)).toBe(Currency.USD_CURRENCY_CODE);
    expect(getChosenCurrencyCode(esLanguage)).toBe(Currency.EUR_CURRENCY_CODE);
  });

  it('getChosenCurrencySign should return correct currency sign depending on currency code', () => {
    const rubCurrencyCode = Currency.RUB_CURRENCY_CODE;
    const usdCurrencyCode = Currency.USD_CURRENCY_CODE;
    const eurCurrencyCode = Currency.EUR_CURRENCY_CODE;

    expect(getChosenCurrencySign(rubCurrencyCode)).toBe(Currency.RUB_CURRENCY_SIGN);
    expect(getChosenCurrencySign(usdCurrencyCode)).toBe(Currency.USD_CURRENCY_SIGN);
    expect(getChosenCurrencySign(eurCurrencyCode)).toBe(Currency.EUR_CURRENCY_SIGN);
  });

});
