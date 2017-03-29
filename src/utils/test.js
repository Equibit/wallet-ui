import assert from 'chai/chai';
import 'steal-mocha';
import crypto from './crypto';

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
