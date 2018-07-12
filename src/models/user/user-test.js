import assert from 'chai/chai'
import fixture from 'can-fixture'
import 'steal-mocha'
import User from './user'
import feathersClient from '../feathers-client'
import { mnemonic } from '../mock/mock-keys'
// import { sha3 } from '@equibit/wallet-crypto'

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
  this.timeout(10000)

  describe('generateWalletKeys', function () {
    const mnemonicHash = 'a3889ab3e18e8965f0f3736f55ac2a3b0d519dc55ef1bbee8aa4e4117fc59c21eeec58e03ebf1d968a601366150336df0cf93c28817d8e1dff5c1e2728b42b87'
    const encryptedMnemonic = '0d3e1e7c7b3bc7e6dcaf15786259abeb62360aa75f996152c7922898cdab26e122c68465aa66b69a555a38cbb25d53ae67a8d738bb0dc7a14d7b9b97c8c7dc2cb22e38880397944bb1823f924b7bd269'
    const encryptedKey = 'f37345faa4a626896015fd18f6529f1818767b15b9b4aede93b273a0bc8e527f0d57849e0375d48ffa229b33ae3fb64c6e4b4903243fa600d31ba519770b117bedb0bbc942adeb0bda6f28d8cb50f6ed24f5a9c2f6a049d2e654e116b6981fe34814b39768808b801cb951bdf17784d9'
    // const mnemonicHash = sha3.sha3_512(user.email + mnemonic)
    let user, root
    before(function () {
      user = new User({_id: 0, email: 'user@test.com'})
      // Set password:
      user.updatePasswordCache('123')
      root = user.generateWalletKeys(mnemonic)
    })
    it('should return HDNode', function () {
      assert.ok(root, 'HDNode')
    })
    it('should encrypt mnemonic', function () {
      assert.equal(user.encryptedMnemonic, encryptedMnemonic)
    })
    it('should encrypt key', function () {
      assert.equal(user.encryptedKey, encryptedKey)
    })
    it('should hash mnemonic with email', function () {
      assert.equal(user.mnemonicHash, mnemonicHash)
    })
  })

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
