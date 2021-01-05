const { Extra, Markup } = require('telegraf');
const { getInformationButtons } = require('./buttons/information');
const { getEditButtons } = require('./buttons/edit');

class MainMenu {
  static getMainMenu(i18n) {
    const informationButtons = getInformationButtons(i18n);
    const editButtons = getEditButtons(i18n);
    const inlineKeyboard = Markup.inlineKeyboard([
      ...informationButtons,
      ...editButtons
    ]);    
    const mainMenu = Extra.markup(inlineKeyboard);

    return mainMenu;
  }
}

module.exports = MainMenu;
