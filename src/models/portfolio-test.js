import assert from 'chai/chai';
import 'steal-mocha';
import Portfolio, { getNextAddressIndex } from './portfolio';

describe('models/portfolio', function () {
 it('should getNextAddressIndex', function () {
   const addresses = {
     eqb: {0: {used: true}, 1: {used: false}},
     btc: {0: {used: true}, 1: {used: true}},
   };
   assert.deepEqual(getNextAddressIndex(addresses, 'eqb'), {index: 1, imported: true});
   assert.deepEqual(getNextAddressIndex(addresses, 'btc'), {index: 2, imported: false});
 });
});