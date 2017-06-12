import assert from 'chai/chai';
import 'steal-mocha';
import { getNextAddressIndex } from './portfolio';

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
});
