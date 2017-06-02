import assert from 'chai/chai';
import 'steal-mocha';
import crypto from './crypto';
import stache from 'can-stache';
import './stache-helpers/stache-helpers';
import { toMaxPrecision } from '~/utils/formatter';

describe('utils/crypto', function () {
  it('mnemonicToSeed', function () {
    let mnemonic = crypto.generateMnemonic();
    let seed = crypto.mnemonicToSeed(mnemonic);
    assert.ok(seed instanceof Uint8Array, 'seed should be an array of 8-bit unsigned integers');
    assert.equal(seed.length, 64, 'seed should be 8 * 64 = 512 bit');
  });
  it('mnemonicToHDNode', function () {
    let mnemonic = crypto.generateMnemonic();
    let pk = crypto.mnemonicToHDNode(mnemonic);
    assert.ok(pk.chainCode instanceof Uint8Array, 'chainCode should be an array of 8-bit unsigned integers');
    assert.ok(pk.keyPair.compressed, 'keyPair should be compressed');
  });
  it('encrypts and decrypts', function () {
    const original = 'this is a test';
    const key = 'my secret key';
    const encrypted = crypto.encrypt(original, key);
    const decrypted = crypto.decrypt(encrypted, key);
    assert(original === decrypted);
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
  describe('one-of', function () {
    it('should resolve in true if value is one of the provided values', function () {
      let frag = stache('{{#if one-of(value, "foo", "bar")}}OK{{/if}}')({value: 'foo'});
      assert.equal(frag.textContent, 'OK');
    });
    it('should resolve in false when value is not one-of', function () {
      let frag = stache('{{^if one-of(value, "foo", "bar")}}OK{{/if}}')({value: 'baz'});
      assert.equal(frag.textContent, 'OK');
    });
  });
});

describe('formatter', function () {
  it('should format to max precision of 8', function () {
    assert.equal(toMaxPrecision(1.123456789, 8), 1.12345679);
    assert.equal(toMaxPrecision(1.123456789, 8).toString(), '1.12345679');
  });
  it('should not add extra zeros', function () {
    assert.equal(toMaxPrecision(1.12345, 8).toString(), '1.12345');
  });
});
