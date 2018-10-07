const assert = require('assert');
const draft = require('./draft');
const ArgsMap = require('../parser');

describe('Draft', function() {
  it('should parse leader names', function() {
    let message = {
      content: '/draft bans=fred,gorgo,something_unknown'
    }
    let argsMap = new ArgsMap(message);
    assert.deepEqual(draft.parseBans(argsMap), ['Frederick Barbarossa', 'Gorgo']);
  });
})