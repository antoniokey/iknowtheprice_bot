const { Markup } = require('telegraf');

const getLanguageButtons = i18n => {
  const ruLanguageButtonText = i18n.t('ruLanguageButton');
  const enLanguageButtonText = i18n.t('enLanguageButton');
  const esLanguageButtonText = i18n.t('esLanguageButton');

  const ruButton = Markup.callbackButton(ruLanguageButtonText, 'ru');
  const enButton = Markup.callbackButton(enLanguageButtonText, 'en');
  const esButton = Markup.callbackButton(esLanguageButtonText, 'es');

  return [ruButton, enButton, esButton];
};

module.exports = { getLanguageButtons };
