import assert from 'chai/chai';
import 'steal-mocha';
import utils from './crypto';

describe('models/user bip39', function () {
  it('should getList', function (done) {
    let pk = utils.generateMnemonic();

    console.log(`1pk = ${pk}`);
    assert.ok(true);
    done();
  });
});
