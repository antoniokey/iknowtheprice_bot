const { LanguageMenu, CurrencyMenu, CancelMenu } = require('../config/inline-menu');
const { interactionAfterAnAction, showPriceListMessage } = require('../utils/price-list');

const handleGetLanguage = async ctx => {
  const { i18n, reply } = ctx;
  const languageMessage = i18n.t('chosenLanguageMessage');

  await reply(languageMessage);
};

const handleGetCurrency = async ctx => {
  const { session, i18n, reply } = ctx;
  const chosenCurrency = session.priceListCurrencyCode;
  const currencyMessage = i18n.t('chosenCurrencyMessage', { chosenCurrency });

  await reply(currencyMessage);
};

const handleGetAmountOfPersons = async ctx => {
  const { session, i18n, reply } = ctx;
  const chosenAmountOfPersons = session.amountOfPersons;
  const chosenAmountOfPersonsMessage = i18n.t('chosenAmountOfPersonsMessage', { chosenAmountOfPersons });

  await reply(chosenAmountOfPersonsMessage);
};

const handleSetLanguage = async ctx => {
  const { reply, i18n } = ctx;
  const setLanguageQuestionMessage = i18n.t('setLanguageQuestionMessage');

  await reply(setLanguageQuestionMessage, LanguageMenu.getLanguageMenu(i18n));
};

const handleSetCurrency = async ctx => {
  const { reply, i18n } = ctx;
  const setCurrencyQuestionMessage = i18n.t('setCurrencyQuestionMessage');

  await reply(setCurrencyQuestionMessage, CurrencyMenu.getCurrencyMenu());
};

const handleSetAmountOfPersons = async ctx => {
  const { reply, i18n, session } = ctx;
  const setAmountOfPersonsQuestionMessage = i18n.t('setAmountOfPersonsQuestionMessage');

  session.isPriceListMode = false;

  await reply(setAmountOfPersonsQuestionMessage, CancelMenu.getCancelMenu(i18n));
};

const handleSetLanguageAction = async ctx => {
  const { match, i18n } = ctx;
  const language = match;

  i18n.locale(language);

  const chosenLanguageMessage = i18n.t('chosenLanguageMessage');

  await interactionAfterAnAction(ctx, chosenLanguageMessage);
};

const handleSetCurrencyAction = async ctx => {
  const { session, i18n, match } = ctx;
  const chosenCurrency = match.toUpperCase();

  session.priceListCurrencyCode = chosenCurrency;

  const chosenCurrencyMessage = i18n.t('chosenCurrencyMessage', { chosenCurrency });

  await interactionAfterAnAction(ctx, chosenCurrencyMessage);
};

const handleCancel = async ctx => {
  const { session } = ctx;

  if (!session.isPriceListMode) {
    session.isPriceListMode = true;
  }

  await showPriceListMessage(ctx);
};

module.exports = {
  handleGetLanguage,
  handleGetCurrency,
  handleGetAmountOfPersons,
  handleSetLanguage,
  handleSetCurrency,
  handleSetAmountOfPersons,
  handleSetLanguageAction,
  handleSetCurrencyAction,
  handleCancel
};
