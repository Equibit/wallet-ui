import assert from 'chai/chai';
import 'steal-mocha';
import User from './user';
import feathersClient from '~/models/feathers-client-rest';

// describe('models/user', function () {
//  it('should getList', function (done) {
//    // User.getList().then(function (items) {
//    //  assert.equal(items.length, 2);
//    //  assert.equal(items.item(0).description, 'First item');
//    //  done();
//    // });
//    assert.ok(true);
//    done();
//  });
// });

describe('models/user', function () {
  it('should generateKeys', function () {
    let user = new User({});
    let keys = user.generateKeys();
    console.log('keys:', keys);

    assert.ok(keys.mnemonic, 'mnemonic');
    assert.ok(keys.privateKey.keyPair.compressed, 'private key compressed');
    // assert.ok(keys.publicKey, 'public key');
  });

  it('should handle a new user without id', function (done) {
    let email = 'test@bitovi.com';
    feathersClient.service('users').create({ email }).then(function () {
      assert.ok('User created');
      done();
    });
  });

  it('should handle a new user with id', function (done) {
    let email = 'test@bitovi.com';
    feathersClient.service('users').create({ _id: 1, email }).then(function () {
      assert.ok('User created');
      done();
    });
  });
});
