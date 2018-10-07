const ArgsMap = require('../parser');
const rules = require('../models/rules.json').ru;
const civs = require('../models/civs.json');

module.exports = {
  name: 'rules',
  /**
   * 
   * @param {message} message 
   * @param {ArgsMap} argsMap 
   */
  execute(message, argsMap) {
    if (argsMap.flags.length) {
      if (argsMap.hasFlag('leader-names')) {
        message.reply(`Leader names list:\n${civs.civilizations.map(civ => civ.leader).join('\n')}`);
      }
      if (argsMap.hasFlag('draft')) {
        message.reply(`\n${rules.draft}`);
      }
      if (argsMap.hasFlag('default-bans')) {
        message.reply(`Default bans: \n${civs.defaultBans.join('\n')}`);
      }
    }
    else {
      message.reply(`\n${rules.defaultRules}`);
    }
  }
}