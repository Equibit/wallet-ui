import assert from 'chai/chai'
import 'steal-mocha'
import Session from '~/models/session'

import './fixtures/portfolio'
import './fixtures/listunspent'
import userMock from './mock/mock-user'

describe('models/session', function () {
  describe('property getters', function () {
    const session = new Session({})
    it('should populate portfolio', function (done) {
      session.on('portfolios', function () {
        assert.equal(session.portfolios.length, 1)
        assert.equal(session.portfolios[0].keys.BTC.keyPair.compressed, true)
        assert.equal(session.portfolios[0].keys.EQB.keyPair.compressed, true)
        assert.equal(session.portfolios[0].addressesMeta.length, 2)
        assert.equal(session.portfolios[0].addresses[0].address, 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA')
        assert.equal(session.portfolios[0].addresses[1].address, 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo')
        done()
      })
    })
    it('should populate balance', function (done) {
      const totalInBtc = 770000000 * session.rates.eqbToBtc
      session.on('balance', function (ev, newVal, oldVal) {
        console.log('on.balance', ev, newVal, oldVal)
        if (!session.balance || session.balance.isPending){
          return
        }
        assert.deepEqual(session.balance.summary, {
          total: totalInBtc,
          cash: totalInBtc,
          securities: 0
        })
        assert.equal(session.portfolios[0].balance.total, totalInBtc)
        done()
      })
    })

    session.user = userMock
  })
})
