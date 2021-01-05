const { Extra, Markup } = require('telegraf');
const currencyButtons = require('./buttons/currency');

class CurrencyMenu {
  static getCurrencyMenu() {
    const inlineKeyboard = Markup.inlineKeyboard(currencyButtons);
    const currencyMenu = Extra.markup(inlineKeyboard);

    return currencyMenu;
  }
}

module.exports = CurrencyMenu;
