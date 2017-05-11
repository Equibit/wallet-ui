import './fixtures/';

import '~/models/user/user-test';

import assert from 'chai/chai';
import 'steal-mocha';
import MarketCap from './market-cap';


describe('models/market-cap', function () {
  it('should project list for barchart data', function () {
    let m = new MarketCap.List([
      { companyName: 'Company 1', price: 100 },
      { companyName: 'Company 2', price: 200 }
    ]);
    assert.deepEqual(m.barChart, {labels: ['x', 'Company 1', 'Company 2'], values: ['MarketCap', 100, 200]});
  });
});