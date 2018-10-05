const DEFAULT_DRAFT_SIZE = require('../models/civs.json').defaultDraftSize;

module.exports = {
  /**
   * returns argsMap object, containinig 
   * attributes key-value map
   * and flags array
   * @param {string} args Arguments to be parsed
   */
  parseArgs(args) {
    let argsMap = {
    };
    argsMap.flags = [];
    argsMap.attrs = {};
  
    for (let arg of args) {
      let attribute, value
      let parsedArg = arg.split('=');
  
      // Populate key=value pairs
      if(parsedArg.length > 1) {
        attribute = parsedArg[0];
        value = parsedArg.slice(1, parsedArg.length).join('');
        argsMap.attrs[attribute] = value;
      }
      // Populate flags and draft size
      else if (parseInt(arg)) {
        argsMap.attrs.playersCount = parseInt(arg);
      }
      else if(arg.startsWith('--')) {
        argsMap.flags.push(arg.replace('--', ''));
      }
    }
    if (!argsMap.attrs.playersCount) {
      argsMap.attrs.playersCount = DEFAULT_DRAFT_SIZE;
    }
    return argsMap;
  },
  /**
   * returns true if argsMap contains desired flag
   * @param {argsMap} argsMap argsMap object
   * @param {string} flag desired flag
   */
  hasFlag(argsMap, flag) {
    if (argsMap.flags.findIndex(f => f === flag) !== -1) return true
    return false;
  }
}