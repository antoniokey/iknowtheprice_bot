const { Command } = require('../enum');

const START_COMMAND = `/${Command.START}`;
const HELP_COMMAND = `/${Command.HELP}`;

module.exports = [START_COMMAND, HELP_COMMAND];
