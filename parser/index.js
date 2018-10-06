const DEFAULT_DRAFT_SIZE = require('../models/civs.json').defaultDraftSize;

module.exports = class ArgsMap {
  constructor(message) {
    this.attributes = {}
    this.flags = [];

    const args = message.content.substr(1).split(/ +/);
    this.command = args.shift().toLowerCase();

    this._parseArgs(args);
  }

  _parseArgs(args) {
    for (let arg of args) {
      let attribute, value, parsedArg = arg.split('=');

      if (parsedArg.length > 1) {
        attribute = parsedArg[0];
        value = parsedArg.slice(1, parsedArg.length).join('');
        this.attributes[attribute] = value;
      }
      else if (parseInt(arg)) {
        this.attributes.playersCount = parseInt(arg);
      }
      else if (arg.startsWith('--')) {
        this.flags.push(arg.replace('--', ''));
      }
    }

    if(!this.attributes.playersCount) {
      this.attributes.playersCount = DEFAULT_DRAFT_SIZE;
    }
  }

  hasFlag(flag) {
    flag = flag.replace('--', '');
    if (this.flags.findIndex(f => f === flag) !== -1) return true;
    return false;
  }
}