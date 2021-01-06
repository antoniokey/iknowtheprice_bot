const dotenv = require('dotenv');
const { Language } = require('../../src/enum');
const { handlePriceList } = require('../../src/handlers/price-list');

describe('Price List Handlers', () => {
  let ctx;
  let session;
  let i18n;
  
  beforeAll(() => {
    dotenv.config();
  });

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
  });

  it('Should change the amountOfPersons prop of the session object when isPriceListMode prop of the session object is is to false', async done => {
    ctx.session.isPriceListMode = false;
    ctx.session.amountOfPersons = 1;
    ctx.message = { text: '3' };

    await handlePriceList(ctx);

    expect(ctx.session.isPriceListMode).toBeTruthy();
    expect(ctx.session.amountOfPersons).toBe(3);

    done();
  });

});
