import assert from 'chai/chai';
import 'steal-mocha';
import { getNextAddressIndex, poftfolioBalance } from './portfolio';

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

  describe('poftfolioBalance', function () {
    const listunspent = {
      summary: {'total': 4.9},
      n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 1.5 },
      n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo: { amount: 3.4 },
      n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA: { amount: 2.2 },
    };
    const portfolioAddresses = ['n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'n4iN6cGkFEctaS3uiQf57xmiidA72S7QdA','empty'];
    it('should calculate portfolio balance by addresses', function () {
      assert.equal(poftfolioBalance(listunspent, portfolioAddresses), 3.7);
    });
  });
});
