const { Markup } = require('telegraf');

const getInformationButtons = i18n => {
  const displayLanguageButtonText = i18n.t('displayLanguageButtonText');
  const displayCurrencyButtonText = i18n.t('displayCurrencyButtonText');
  const displayAmountOfPersonsButtonText = i18n.t('displayAmountOfPersonsButtonText');

  const displayLanguageButton = Markup.callbackButton(displayLanguageButtonText, 'getLanguage');
  const displayCurrencyButton = Markup.callbackButton(displayCurrencyButtonText, 'getCurrency');
  const displayAmountOfPersonsButton = Markup.callbackButton(displayAmountOfPersonsButtonText, 'getAmountOfPersons');

  return [
    [displayLanguageButton, displayCurrencyButton],
    [displayAmountOfPersonsButton]
  ];
};

module.exports = { getInformationButtons };
