import assert from 'chai/chai';
import 'steal-mocha';
import utils from './crypto';
import user

describe('models/user bip39', function () {
  it('should getList', function (done) {
    //let user = new User({});
    //let pk = user.generatePrivateKey();
    let pk = utils.generateMnemonic();

    console.log(`1pk = ${pk}`);
    assert.ok(true);
    done();
  });
});