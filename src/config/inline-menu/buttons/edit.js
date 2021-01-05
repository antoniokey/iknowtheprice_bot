const { Markup } = require('telegraf');

const getEditButtons = i18n => {
  const setLanguageButtonText = i18n.t('setLanguageButtonText');
  const setCurrencyButtonText = i18n.t('setCurrencyButtonText');
  const setAmountOfPersonsButtonText = i18n.t('setAmountOfPersonsButtonText');

  const setLanguageButton = Markup.callbackButton(setLanguageButtonText, 'setLanguage');
  const setCurrencyButton = Markup.callbackButton(setCurrencyButtonText, 'setCurrency');
  const setAmountOfPersonsButton = Markup.callbackButton(setAmountOfPersonsButtonText, 'setAmountOfPersons');

  return [
    [setLanguageButton, setCurrencyButton],
    [setAmountOfPersonsButton]
  ];
};

module.exports = { getEditButtons };
