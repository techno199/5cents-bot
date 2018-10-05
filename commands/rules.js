const parser = require('../parser');
const rules = require('../models/rules.json');
const civs = require('../models/civs.json');

module.exports = {
  name: 'rules',
  execute(message, args) {
    let argsMap = parser.parseArgs(args);
    if (argsMap.flags.length) {
      if (parser.hasFlag(argsMap, 'leader-names')) {
        message.reply(`${rules.leaderNames}\n${civs.civilizations.map(civ => civ.leader).join('\n')}`);
      }
      if (parser.hasFlag(argsMap, 'draft')) {
        message.reply(`${rules.draft}`);
      }
      if (parser.hasFlag(argsMap, 'default-bans')) {
        message.reply(`${rules.defaultBans}\n${civs.defaultBans.join('\n')}`);
      }
    }
    else {
      message.reply(rules.defaultRules);
    }
  }
}