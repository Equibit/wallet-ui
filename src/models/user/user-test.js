import assert from 'chai/chai'
import fixture from 'can-fixture'
import 'steal-mocha'
import User from './user'
import feathersClient from '../feathers-client'

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
  this.timeout(5000)
  // it('should generateKeys', function () {
  //   let user = new User({});
  //   let keys = user.generateKeys();
  //   console.log('keys:', keys);
  //
  //   assert.ok(keys.mnemonic, 'mnemonic');
  //   assert.ok(keys.privateKey.keyPair.compressed, 'private key compressed');
  //   // assert.ok(keys.publicKey, 'public key');
  // });

  it('should handle a new user without id', function (done) {
    let email = 'test@bitovi.com'
    feathersClient.service('users').create({ email }).then(function () {
      assert.ok('User created')
      done()
    })
    .catch(error => {
      assert(!error, 'this error should not have occurred.')
      done()
    })
  })

  it('should handle a new user with id', function (done) {
    let email = 'test@bitovi.com'
    feathersClient.service('users').create({ _id: 1, email }).then(function () {
      assert.ok('User created')
      done()
    })
  })

  it('should sign the request', function (done) {
    let email = 'test@bitovi.com'

    feathersClient.service('users').hooks({
      before: {
        create (hook) {
          assert(hook.data.signature, 'the data contained a signature')
        }
      },
      after: {
        create (hook) {
          hook.result.hooksRanSuccessfully = true
        }
      }
    })

    feathersClient.service('users').create({ _id: 1, email }).then(function (user) {
      assert(user.hooksRanSuccessfully === true, 'the signing hooks ran properly')
      done()
    })
  })

  describe('static methods', function () {
    describe('#login', function () {
      let loginAssertions = 0
      fixture('POST /authentication', function (request, response) {
        console.log(`FIXTURE!!! request.data.strategy = ${request.data.strategy}`, request.data)
        if (request.data.strategy === 'challenge-request') {
          loginAssertions++
          assert.ok(true, 'challenge-request strategy sent')
          response({
            'salt': 'some-salt',
            'challenge': 'some-challenge'
          })
        }
        if (request.data.strategy === 'challenge') {
          loginAssertions++
          assert.ok(true, 'challenge strategy sent')
          response({
            'accessToken': 'some-token',
            'user': {
              '_id': '123',
              'email': 'ilya@bitovi.com',
              'updatedAt': '2017-04-06T22:45:46.942Z',
              'createdAt': '2017-04-06T22:45:46.942Z',
              'isNewUser': false
            }
          })
        }
      })
      it('should use correct strategies', function (done) {
        User.login('ilya@bitovi.com', '123').then(function () {
          assert.equal(loginAssertions, 2)
          done()
        }).catch(err => {
          console.log(`ERROR!!! loginAssertions=${loginAssertions}`, err)
        })
      })
    })
    describe('#signup', function () {
      it('should make a create user request', function (done) {
        User.signup('ilya@bitovi.com').then(function (data) {
          assert.equal(data.email, 'ilya@bitovi.com')
          done()
        })
        .catch(error => {
          assert(!error, 'this should not happen')
        })
      })
    })
    describe('#forgotPassword', function () {
      let count = 0
      let email = 'ilya@bitovi.com'
      fixture('POST /forgot-password', function (request, response) {
        count++
        assert.equal(request.data.email, email)
        response(request.data)
      })
      it('should send email to forgot-password service', function (done) {
        User.forgotPassword(email).then(function (data) {
          assert.equal(data.email, email)
          assert.equal(count, 1)
          done()
        })
      })
    })
  })
})
