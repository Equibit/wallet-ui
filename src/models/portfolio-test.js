import assert from 'chai/chai'
import 'steal-mocha'
import Portfolio from './portfolio'
import { omit } from 'ramda'
import portfolio, { addressesMeta } from './mock/mock-portfolio'
import listunspent from './mock/mock-listunspent'
import utils, { filterUniqAddr } from './portfolio-utils'
const {
  // importAddr,
  getNextAddressIndex,
  getUnspentOutputsForAmount,
  // fetchBalance,
  getAllUtxo
} = utils

describe('models/portfolio-utils', function () {
  describe('getNextAddressIndex', function () {
    it('should return next available index', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'BTC'), {index: 2, imported: true})
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'EQB'), {index: 1, imported: true})
    })
    it('should return next available index for a change address', function () {
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'BTC', true), {index: 1, imported: true})
      assert.deepEqual(getNextAddressIndex(addressesMeta, 'EQB', true), {index: 1, imported: false})
    })
  })

  describe('getUnspentOutputsForAmount', function () {
    const txouts = [
      {'amount': 1},
      {'amount': 2},
      {'amount': 3}
    ]
    it('should return the 1st tx output', function () {
      const txouts1 = getUnspentOutputsForAmount(txouts, 1).txouts
      assert.deepEqual(txouts1, [{'amount': 1}])
    })
    it('should return the 2nd tx output', function () {
      const txouts2 = getUnspentOutputsForAmount(txouts, 2).txouts
      assert.deepEqual(txouts2, [{'amount': 2}])
    })
    // TODO: optimize since having 1 and 3 is enough for 4.
    it('should return all three outputs', function () {
      const txouts3 = getUnspentOutputsForAmount(txouts, 4).txouts
      assert.deepEqual(txouts3, [{'amount': 1}, {'amount': 2}, {'amount': 3}])
    })
  })

  describe('getAllUtxo', function () {
    it('should collect all utxo by addresses', function () {
      const utxo = getAllUtxo(listunspent.BTC.addresses)
      assert.equal(utxo.length, 3)
    })
  })
})

describe('models/portfolio', function () {
  describe('instance properties', function () {
    const expectedAddresses = [
      {index: 0, type: 'BTC', address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', isChange: false},
      {index: 1, type: 'BTC', address: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA', isChange: false},
      {index: 2, type: 'BTC', address: 'mu2DDd2d9yDzS9PoqZrjD6e1ZnmgJnpv54', isChange: false},
      {index: 0, type: 'BTC', address: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', isChange: true},
      {index: 1, type: 'BTC', address: 'muJpBHeXzMGoFdUDTUanwwfZSG43Ec6zd8', isChange: true},

      {index: 0, type: 'EQB', address: 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo', isChange: false},
      {index: 1, type: 'EQB', address: 'mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU', isChange: false},
      {index: 0, type: 'EQB', address: 'muMQ9mZjBy2E45QcWb1YZgD45mP3TfN3gC', isChange: true}
    ]
    it('should populate addresses', function () {
      assert.equal(portfolio.addresses.length, 8)
      assert.deepEqual(omit(['keyPair', 'meta'], portfolio.addresses[0]), expectedAddresses[0])
    })

    it('should populate addressesBtc and addressesEqb', function () {
      const expectedAddressesBtc = expectedAddresses.filter(({type}) => type === 'BTC').map(({address}) => address)
      const expectedAddressesEqb = expectedAddresses.filter(({type}) => type === 'EQB').map(({address}) => address)
      assert.deepEqual(portfolio.addressesBtc.get(), expectedAddressesBtc)
      assert.deepEqual(portfolio.addressesEqb.get(), expectedAddressesEqb)
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
      assert.deepEqual((balance.get ? balance.get() : balance), expectedBalance)
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

  describe('utxoByType', function () {
    it('should return flat lists of utxo by type', function () {
      assert.equal(portfolio.utxoByType.BTC.length, 3)
      assert.equal(portfolio.utxoByType.BTC[0].address, 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA')
      assert.equal(portfolio.utxoByType.EQB.length, 2)
    })
  })

  describe('hasEnoughFunds', function () {
    it('should check funds for BTC', function () {
      assert.equal(portfolio.hasEnoughFunds(900000000, 'BTC'), false)
      assert.equal(portfolio.hasEnoughFunds(900000000, 'BTC'), false)
    })
    it('should indicate enough funds for EQB', function () {
      assert.equal(portfolio.hasEnoughFunds(300000000, 'EQB'), true)
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

describe('portfolio-utils/filterUniqAddr', function () {
  it('should filter out dup addresses meta', function () {
    const dups = [
      {'_id': '1', 'portfolioId': '5a590cd3e3673d2971171b29', 'index': 0, 'type': 'EQB', 'updatedAt': '2018-01-30T18:58:43.981Z', 'createdAt': '2018-01-12T19:30:27.993Z', 'isUsed': true, 'isChange': false},
      {'_id': '2', 'portfolioId': '5a590cd3e3673d2971171b29', 'index': 0, 'type': 'EQB', 'updatedAt': '2018-01-30T18:58:43.981Z', 'createdAt': '2018-01-12T19:30:27.993Z', 'isUsed': true, 'isChange': false},
      {'_id': '3', 'portfolioId': '5a590cd3e3673d2971171b29', 'index': 0, 'type': 'BTC', 'updatedAt': '2018-01-30T18:58:43.981Z', 'createdAt': '2018-01-12T19:30:27.993Z', 'isUsed': true, 'isChange': false}
    ]
    const uniq = filterUniqAddr(dups)
    assert.equal(uniq.length, 2)
  })
})
