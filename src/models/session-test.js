import assert from 'chai/chai'
import 'steal-mocha'
import Session from '~/models/session'
import currencyConverter from '~/utils/currency-converter'

import './fixtures/portfolio'
import './fixtures/listunspent'
import userMock from './mock/mock-user'

describe('models/session', function () {
  describe('property getters', function () {
    this.timeout(10000)
    const session = new Session({})
    let totalInBtc
    before(() => {
      const BTCUSD = 10000
      const EQBUSD = 1000
      currencyConverter.injectRates({
        BTCUSD,
        EQBUSD
      })
      totalInBtc = 210000000 /* <- BTC */ + 560000000 /* <- EQB */ * EQBUSD / BTCUSD
    })
    it('should populate portfolio', function (done) {
      session.on('portfolios', function () {
        assert.equal(session.portfolios.length, 1)
        assert.ok(session.portfolios[0].keys.BTC.node.chainCode)
        assert.ok(session.portfolios[0].keys.EQB.node.chainCode)
        assert.equal(session.portfolios[0].keys.BTC.ecPair.compressed, true)
        assert.equal(session.portfolios[0].keys.EQB.ecPair.compressed, true)
        assert.equal(session.portfolios[0].addressesMeta[0].type, 'BTC')
        session.portfolios[0].get('addresses')
        session.portfolios[0].addressesPromise.then(addresses => {
          assert.equal(addresses[0].address, 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA')
          assert.equal(addresses[1].address, 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA')
          done()
        })
      })
    })
    it('should populate balance', function (done) {
      function balanceHandler (ev, newVal, oldVal) {
        console.log('on.balance', ev, newVal, oldVal)
        if (!session.balance || session.balance.isPending) {
          return
        }
        assert.deepEqual(session.balance.summary, {
          total: totalInBtc,
          cash: totalInBtc,
          securities: 0
        })
        assert.equal(session.portfolios[0].balance.total, totalInBtc)
        session.off('balance', balanceHandler)
        done()
      }
      session.on('balance', balanceHandler)
    })

    session.user = userMock
  })
})
