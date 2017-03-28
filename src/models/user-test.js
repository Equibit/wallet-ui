import assert from 'chai/chai';
import 'steal-mocha';
import User from './user';

//describe('models/user', function () {
//  it('should getList', function (done) {
//    // User.getList().then(function (items) {
//    //  assert.equal(items.length, 2);
//    //  assert.equal(items.item(0).description, 'First item');
//    //  done();
//    // });
//    assert.ok(true);
//    done();
//  });
//});

describe('models/user generateKeys', function () {
  it('should getList', function () {
    let user = new User({});
    let keys = user.generateKeys();
    console.log('keys:', keys);

    assert.ok(keys.mnemonic);
    assert.ok(keys.privateKey);
    assert.ok(keys.publicKey);
  });
});
