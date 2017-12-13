import assert from 'chai/chai'
import 'steal-mocha'
import stache from 'can-stache'

import crypto from './crypto'
import './stache-helpers/stache-helpers'
import '~/models/mock/mock-session'
import './random-elements-test'
import './test-mocha'
import { localCurrency } from './formatter'
// import { encode as scriptNumberEncode } from './script_number'

describe('utils/crypto', function () {
  it('mnemonicToSeed', function () {
    let mnemonic = crypto.generateMnemonic()
    let seed = crypto.mnemonicToSeed(mnemonic)
    assert.ok(seed instanceof Uint8Array, 'seed should be an array of 8-bit unsigned integers')
    assert.equal(seed.length, 64, 'seed should be 8 * 64 = 512 bit')
  })
  it('mnemonicToHDNode', function () {
    let mnemonic = crypto.generateMnemonic()
    let pk = crypto.mnemonicToHDNode(mnemonic)
    assert.ok(pk.chainCode instanceof Uint8Array, 'chainCode should be an array of 8-bit unsigned integers')
    assert.ok(pk.keyPair.compressed, 'keyPair should be compressed')
  })
  it('encrypts and decrypts', function () {
    const original = 'this is a test'
    const key = 'my secret key'
    const encrypted = crypto.encrypt(original, key)
    const decrypted = crypto.decrypt(encrypted, key)
    assert(original === decrypted)
  })
  // it('encrypts scriptNumberEncode', function () {
  //   const scriptNumber1 = scriptNumberEncode(10)
  //   const scriptNumber3 = scriptNumberEncode(50)
  //   const scriptNumber2 = scriptNumberEncode(144)
  //   assert.equal(scriptNumber1.toString('hex'), '0a')
  //   assert.equal(scriptNumber2.toString('hex'), '32')
  //   assert.equal(scriptNumber3.toString('hex'), '9000')
  // })
})

describe('utils/stache-helpers', function () {
  describe('is-lt', function () {
    it('should resolve in true for a negative value', function () {
      let frag = stache('{{#if is-lt(value, 0)}}neg{{/if}}')({value: -5})
      assert.equal(frag.textContent, 'neg')
    })
    it('should resolve in false for a positive value', function () {
      let frag = stache('{{^if is-lt(value, 0)}}pos{{/if}}')({value: 5})
      assert.equal(frag.textContent, 'pos')
    })
  })
  describe('one-of', function () {
    it('should resolve in true if value is one of the provided values', function () {
      let frag = stache('{{#if one-of(value, "foo", "bar")}}OK{{/if}}')({value: 'foo'})
      assert.equal(frag.textContent, 'OK')
    })
    it('should resolve in false when value is not one-of', function () {
      let frag = stache('{{^if one-of(value, "foo", "bar")}}OK{{/if}}')({value: 'baz'})
      assert.equal(frag.textContent, 'OK')
    })
  })
  describe('local-currency', function () {
    it('should show BTC in local currency', function () {
      let frag = stache('{{local-currency(value, "BTC"}}')({value: 100000000})
      assert.equal(frag.textContent, '4,000.00')
    })
    it('should show EQB in local currency', function () {
      let frag = stache('{{local-currency(value, "EQB"}}')({value: 200000000})
      assert.equal(frag.textContent, '6.00')
    })
  })
  describe('local-currency-symbol', function () {
    it('should show the local currency symbol', function () {
      let frag = stache('{{local-currency-symbol(}}')()
      assert.equal(frag.textContent, 'USD')
    })
  })
})

describe('utils/formatter', function () {
  describe('localCurrency', function () {
    it('should convert satoshi to USD', function () {
      assert.equal(localCurrency(100000000, 'BTC'), '4,000.00')
      assert.equal(localCurrency(150000000, 'BTC'), '6,000.00')
      assert.equal(localCurrency(1500, 'BTC'), '0.06')
    })
  })
})
