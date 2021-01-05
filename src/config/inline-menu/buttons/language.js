const { Markup } = require('telegraf');
const { Language } = require('../../../enum');

const getLanguageButtons = i18n => {
  const ruLanguageButtonText = i18n.t('ruLanguageButton');
  const enLanguageButtonText = i18n.t('enLanguageButton');
  const esLanguageButtonText = i18n.t('esLanguageButton');

  const ruButton = Markup.callbackButton(ruLanguageButtonText, Language.RU);
  const enButton = Markup.callbackButton(enLanguageButtonText, Language.EN);
  const esButton = Markup.callbackButton(esLanguageButtonText, Language.ES);

  return [ruButton, enButton, esButton];
};

module.exports = { getLanguageButtons };
