import assert from 'chai/chai'
import 'steal-mocha'
import MarketCap from './market-cap'
import BiggestMovers from './biggest-movers'
import './fixtures/'

describe('models/market-cap', function () {
  it('should project list for barchart data', function () {
    let m = new MarketCap.List([
      { companyName: 'Company 1', price: 100 },
      { companyName: 'Company 2', price: 200 }
    ])
    assert.deepEqual(m.barChart, {labels: ['x', 'Company 1', 'Company 2'], values: [['MarketCap', 100, 200]]})
  })
})

describe('connection algebra', function () {
  // todo: enable
  it('should be able to fetch BiggestMovers with NO limit', function () {
    return BiggestMovers.getList({}).then(data => {
      assert.equal(data.length, 50)
    })
  })
  it.skip('should be able to fetch BiggestMovers with limit', function () {
    return BiggestMovers.getList({$limit: 10, $skip: 0}).then(data => {
      assert.equal(data.length, 10)
    })
  })
})
