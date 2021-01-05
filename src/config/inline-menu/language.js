const { Extra, Markup } = require('telegraf');
const { getLanguageButtons } = require('./buttons/language');

class LanguageMenu {
  static getLanguageMenu(i18n) {
    const languageButtons = getLanguageButtons(i18n);
    const inlineKeyboard = Markup.inlineKeyboard(languageButtons);
    const languageMenu = Extra.markup(inlineKeyboard);

    return languageMenu;
  }
}

module.exports = LanguageMenu;
