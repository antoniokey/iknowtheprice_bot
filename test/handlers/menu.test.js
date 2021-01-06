const { Language, Currency } = require('../../src/enum');
const {
  handleSetAmountOfPersons,
  handleSetLanguageAction,
  handleSetCurrencyAction,
  handleCancel
} = require('../../src/handlers/menu');

describe('Menu handlers', () => {
  let ctx;
  let session;
  let i18n;

  beforeEach(() => {
    session = {};
    i18n = {
      languageCode: Language.RU,

      locale(languageCode) {
        this.languageCode = languageCode;
      },

      t() {},
    };
    ctx = {
      session,
      i18n,
      reply() {},
    };
  })

  it('Should set isPriceListMode of the session object to false when click set amount of persons button', async done => {
    ctx.session.isPriceListMode = true;

    await handleSetAmountOfPersons(ctx);
  
    expect(ctx.session.isPriceListMode).toBeFalsy();

    done();
  });

  it('Should set proper language when click set language button', async done => {
    ctx.match = Language.EN;

    await handleSetLanguageAction(ctx);

    expect(ctx.i18n.languageCode).toBe(Language.EN);

    done();
  });

  it('Should set proper currency when click set currency button', async done => {
    ctx.match = Currency.USD_CURRENCY_CODE.toLowerCase();
    ctx.session.priceListCurrencyCode = Currency.RUB_CURRENCY_CODE;

    await handleSetCurrencyAction(ctx);

    expect(ctx.session.priceListCurrencyCode).toBe(Currency.USD_CURRENCY_CODE);

    done();
  });

  it('Should set isPriceListMode prop of the session object to true when click the cancel button', async done => {
    ctx.session.isPriceListMode = false;

    await handleCancel(ctx);
    
    expect(ctx.session.isPriceListMode).toBeTruthy();

    done();
  });

});
