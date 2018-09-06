import assert from 'chai/chai'
import 'steal-mocha'
import {
  timeStats
} from './offer'
import { blockTime } from '~/constants'

const now = Date.now()
const yesterday = now - (24 * 60 * 60 * 1000)
const lastConf = now - (2 * 60 * 1000)

const fixtures = {
  tx: {
    currencyType: 'BTC',
    timelock: 240,
    createdAt: yesterday
  },
  bcInfo: {
    BTC: {
      mediantime: lastConf / 1000,
      currentBlockHeight: 1000
    }
  }
}

describe('time stats', function () {
  it('should calculate a confirmed tx correctly', function () {
    const result = timeStats(fixtures.tx, 1002, undefined, fixtures.bcInfo)
    assert.equal(result.blocksRemaining, 2)
    assert.equal(result.endAt, lastConf + (2.5 * blockTime.BTC))
  })
  it('should calculate an explicitly expired tx correctly', function () {
    const result = timeStats(fixtures.tx, 1002, new Date(lastConf), fixtures.bcInfo)
    assert.equal(result.blocksRemaining, 2)
    assert.equal(result.endAt, lastConf)
  })
})
