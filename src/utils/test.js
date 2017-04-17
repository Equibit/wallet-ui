import assert from 'chai/chai';
import 'steal-mocha';
import crypto from './crypto';
import stache from 'can-stache';
import './stache-helpers/stache-helpers';

describe('utils/crypto', function () {
  it('mnemonicToSeed', function () {
    let mnemonic = crypto.generateMnemonic();
    let seed = crypto.mnemonicToSeed(mnemonic);
    assert.ok(seed instanceof Uint8Array, 'seed should be an array of 8-bit unsigned integers');
    assert.equal(seed.length, 64, 'seed should be 8 * 64 = 512 bit');
  });
  it('mnemonicToPrivateKey', function () {
    let mnemonic = crypto.generateMnemonic();
    let pk = crypto.mnemonicToPrivateKey(mnemonic);
    assert.ok(pk.chainCode instanceof Uint8Array, 'chainCode should be an array of 8-bit unsigned integers');
    assert.ok(pk.keyPair.compressed, 'keyPair should be compressed');
  });
});

describe('stache-helpers', function () {
  describe('is-lt', function () {
    it('should resolve in true for a negative value', function () {
      let frag = stache('{{#if is-lt(value, 0)}}neg{{/if}}')({value: -5});
      assert.equal(frag.textContent, 'neg');
    });
    it('should resolve in false for a positive value', function () {
      let frag = stache('{{^if is-lt(value, 0)}}pos{{/if}}')({value: 5});
      assert.equal(frag.textContent, 'pos');
    });
  });
});
