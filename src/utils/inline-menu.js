const { MainMenu } = require('../config/inline-menu');

const showMainMenu = async ctx => {
  const { reply, i18n } = ctx;
  const getPriceListMessage = i18n.t('getPriceListMessage');

  reply(getPriceListMessage, MainMenu.getMainMenu(i18n));
};

module.exports = { showMainMenu }; 
