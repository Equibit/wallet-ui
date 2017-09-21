import assert from 'chai/chai'
import 'steal-mocha'
import Portfolio from './portfolio'
import utils from './portfolio-utils'
const {
  importAddr,
  getNextAddressIndex,
  getUnspentOutputsForAmount,
  fetchBalance
} = utils
// import portfolioAddresses from './fixtures/portfolio-addresses';
import { omit } from 'ramda'
import portfolio, { addressesMeta } from './mock/mock-portfolio'

describe('models/portfolio', function () {
  describe('getNextAddressIndex', function () {
    it('should return next available index', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'BTC'), {index: 2, imported: false})
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'EQB'), {index: 1, imported: true})
    })
    it('should return next available index for a change address', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'BTC', true), {index: 1, imported: false})
    })
  })

  describe('getUnspentOutputsForAmount', function () {
    const txouts = [
      {'amount': 1},
      {'amount': 2},
      {'amount': 3}
    ]
    it('should return the 1st tx output', function () {
      const txouts1 = getUnspentOutputsForAmount(txouts, 1)
      assert.deepEqual(txouts1, [{'amount': 1}])
    })
    it('should return the 2nd tx output', function () {
      const txouts2 = getUnspentOutputsForAmount(txouts, 2)
      assert.deepEqual(txouts2, [{'amount': 2}])
    })
    // TODO: optimize since having 1 and 3 is enough for 4.
    it('should return all three outputs', function () {
      const txouts3 = getUnspentOutputsForAmount(txouts, 4)
      assert.deepEqual(txouts3, [{'amount': 1}, {'amount': 2}, {'amount': 3}])
    })
  })

  describe('instance properties', function () {
    it('should populate addresses', function () {
      const expectedAddresses = [
        {index: 0, type: 'BTC', address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', isChange: false, isUsed: true},
        {index: 1, type: 'BTC', address: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA', isChange: false, isUsed: true},
        {index: 0, type: 'EQB', address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo', isChange: false, isUsed: true},
        {index: 1, type: 'EQB', address: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU', isChange: false, isUsed: false},
        {index: 0, type: 'BTC', address: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', isChange: true, isUsed: true}
      ]
      assert.equal(portfolio.addresses.length, 5)
      assert.deepEqual(omit(['keyPair'], portfolio.addresses[0]), expectedAddresses[0])
    })

    it('should populate addressesBtc and addressesEqb', function () {
      const expectedAddressesBtc = ['n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA', 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ']
      const expectedAddressesEqb = ['n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo', 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU']
      assert.deepEqual(portfolio.addressesBtc, expectedAddressesBtc)
      assert.deepEqual(portfolio.addressesEqb, expectedAddressesEqb)
    })

    it('should populate portfolio balance based on user\'s balance', function () {
      var expectedBalance = {
        cashBtc: 2.1 * 100000000,
        cashEqb: 5.6 * 100000000,
        securities: 0,
        cashTotal: 0, // calc below
        total: 0      // calc below
      }
      expectedBalance.cashTotal = expectedBalance.cashBtc + expectedBalance.cashEqb * portfolio.rates.eqbToBtc
      expectedBalance.total = expectedBalance.cashTotal + expectedBalance.securities
      const balance = portfolio.balance
      assert.deepEqual(balance, expectedBalance)
    })

    it('should populate nextAddress', function (done) {
      const expected = {
        BTC: 'mu2DDd2d9yDzS9PoqZrjD6e1ZnmgJnpv54',
        EQB: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU'
      }
      portfolio.nextAddress().then(function (nextAddress) {
        assert.deepEqual(nextAddress, expected)
        done()
      })
    })
  })

  describe('PortfolioList', function () {
    const portfolios = new Portfolio.List([portfolio])
    it('should findByAddress', function () {
      const p = portfolios.findByAddress('n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA')
      assert.equal(p && p.name, 'My Portfolio')
    })
  })
})
