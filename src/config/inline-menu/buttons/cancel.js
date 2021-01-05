const { Markup } = require('telegraf');

const getCancelButton = i18n => {
  const cancelButtonText = i18n.t('cancelButtonText');
  const cancelButton = Markup.callbackButton(cancelButtonText, 'cancel');

  return [cancelButton];
};

module.exports = { getCancelButton };
