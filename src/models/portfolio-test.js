import assert from 'chai/chai';
import 'steal-mocha';
import Portfolio, { getNextAddressIndex } from './portfolio';
import Session from '~/models/session';
import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';

Session.current = {
  user: {
    generatePortfolioKeys (index) {
      const mnemonic = 'fine raw stuff scene actor crowd flag lend wrap pony essay stamp';
      console.log(mnemonic);
      const seed = bip39.mnemonicToSeed(mnemonic, '');
      const hdNode = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet);
      return {
        btc: hdNode.deriveHardened(index),
        eqb: hdNode.deriveHardened(index)
      };
    }
  }
};

describe('models/portfolio', function () {
  describe('getNextAddressIndex', function () {
    it('should return next available index', function () {
      const addresses = [
        {index: 0, type: 'eqb', used: true},
        {index: 1, type: 'eqb', used: false},
        {index: 0, type: 'btc', used: true},
        {index: 1, type: 'btc', used: true}
      ];
      assert.deepEqual(getNextAddressIndex(addresses, 'eqb'), {index: 1, imported: true});
      assert.deepEqual(getNextAddressIndex(addresses, 'btc'), {index: 2, imported: false});
    });
  });

  const portfolio = new Portfolio({
    index: 0,
    addresses: [
      {index: 0, type: 'eqb', used: true},
      {index: 1, type: 'eqb', used: false},
      {index: 0, type: 'btc', used: true}
    ]
  });
  describe('keys', function () {
    it('should generate portfolio keys', function () {
      assert.equal(portfolio.keys.btc.keyPair.compressed, true);
      assert.equal(portfolio.keys.eqb.keyPair.compressed, true);
    });
  });
  describe('addressesFilled', function () {
    it('should return a list of real addresses generated from indexes', function () {
      assert.equal(portfolio.addressesFilled.length, 3);
      assert.equal(portfolio.addressesFilled[0], 'mfqhW9ygFjrXbNxWXW6qQa6YwKPPXsn2tb');
    });
  });
});
