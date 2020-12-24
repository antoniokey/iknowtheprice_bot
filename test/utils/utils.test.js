const {
  prepareTranslatedData,
  getAveragePriceForTwoPersons
} = require('../../src/utils/utils');

describe('Utils', () => {

  it('prepareTranslatedData should return string with letters or letters and dash', () => {
    const stringWithoutDash = 'WithoutDash';
    const stringWithDash = 'San-Francisco';
    const stringWithOtherSymbols = 'OtherSymbols!!!';
    const expectedStringWithoutDash = 'WithoutDash';
    const expectedStringWithDash = 'San-Francisco';
    const expectedStringWithOtherSymbols = 'OtherSymbols';
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

});
