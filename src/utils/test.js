import assert from 'chai/chai';
import 'steal-mocha';
import crypto from './crypto';
import stache from 'can-stache';
import './stache-helpers/stache-helpers';
import { toMaxPrecision } from '~/utils/formatter';
import Session from '~/models/session';

// Mock Session:
Session.current = new Session({
  user: {
    rates: {
      btcToUsd: 2725,
      eqbToUsd: 3,
      eqbToBtc: 3 / 2725
    }
  }
});

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
  describe('local-currency', function () {
    it('should show BTC in local currency', function () {
      let frag = stache('{{local-currency(value, "BTC"}}')({value: 1});
      assert.equal(frag.textContent, '2,725.00');
    });
    it('should show EQB in local currency', function () {
      let frag = stache('{{local-currency(value, "EQB"}}')({value: 2});
      assert.equal(frag.textContent, '6.00');
    });
  });
  describe('local-currency-symbol', function () {
    it('should show the local currency symbol', function () {
      let frag = stache('{{local-currency-symbol(}}')();
      assert.equal(frag.textContent, 'USD');
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
