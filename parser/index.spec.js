const assert = require('assert');
const ArgsMap = require('./');

describe('Parser', function() {
  let argsMap;
  beforeEach(function() {
    let message = {
      content: '/draft bans=fred,gorgo --no-default-bans'
    }
    argsMap = new ArgsMap(message);
  });
  it('correctly parses command', function() {
    assert.equal(argsMap.command, 'draft');
  });
  it('correctly parses attribute', function() {
    assert.equal(argsMap.attributes['bans'], 'fred,gorgo');
  });
  it('correctly parses flag', function() {
    assert.equal(argsMap.hasFlag('no-default-bans'), true);
  });
})