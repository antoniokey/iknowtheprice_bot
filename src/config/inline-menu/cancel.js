const { Extra, Markup } = require('telegraf');
const { getCancelButton } = require('./buttons/cancel');

class CancelMenu {
  static getCancelMenu(i18n) {
    const cancelButton = getCancelButton(i18n);
    const inlineKeyboard = Markup.inlineKeyboard(cancelButton);
    const cancelMenu = Extra.markup(inlineKeyboard);

    return cancelMenu;
  }
}

module.exports = CancelMenu;
