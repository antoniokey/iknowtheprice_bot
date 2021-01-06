const { Currency } = require('../../src/enum');
const { handleStart } = require('../../src/handlers/command');

describe('Command handlers', () => {

  it('Should set amountOfPersons, priceListCurrencyCode and isPriceListMode of the session object when /start', async done => {
    const session = {};
    const i18n = {
      welcomeMessage: 'Welcome message',
      t(i18nProperty) {
        return this[i18nProperty];
      }
    };
    const ctx = {
      session,
      i18n,
      reply() {},
      replyWithHTML() {},
    };
    
    await handleStart(ctx);

    expect(ctx.session).toHaveProperty('amountOfPersons');
    expect(ctx.session).toHaveProperty('priceListCurrencyCode');
    expect(ctx.session).toHaveProperty('isPriceListMode');

    expect(ctx.session.amountOfPersons).toBe(1);
    expect(ctx.session.priceListCurrencyCode).toBe(Currency.USD_CURRENCY_CODE);
    expect(ctx.session.isPriceListMode).toBeTruthy();

    done();
  });

});
