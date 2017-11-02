import Portfolio from '../portfolio'
import rates from './mock-rates'
import hdNode from './mock-keys'
import listunspent, { listunspentZero, listunspentBtc } from './mock-listunspent'

import feathersClient from '../feathers-client'
feathersClient.service('portfolios').patch = () => Promise.resolve()

const addressesMeta = [
  {index: 0, type: 'BTC', isUsed: true, isChange: false},
  {index: 1, type: 'BTC', isUsed: true, isChange: false},
  {index: 0, type: 'EQB', isUsed: true, isChange: false},
  {index: 1, type: 'EQB', isUsed: false, isChange: false},

  {index: 0, type: 'BTC', isUsed: true, isChange: true}
]

const portfolioKeys = {
  BTC: hdNode.derivePath("m/44'/0'/0'"),
  EQB: hdNode.derivePath("m/44'/73'/0'")
}

const portfolio = new Portfolio({
  _id: '595e5c58711b9e358f567edc',
  index: 0,
  name: 'My Portfolio',
  addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspent,
  rates
})
// Note: `portfolio.nextAddress()` makes a request and connection's real-time behavior requires the instance to be
// in the instanceStore, thus adding a reference to keep it there.
portfolio.constructor.connection.addInstanceReference(portfolio)

const portfolioZero = new Portfolio({
  index: 0,
  name: 'My Portfolio Empty',
  addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspentZero,
  rates
})

const portfolioBtc = new Portfolio({
  index: 0,
  name: 'My Portfolio Empty',
  addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspentBtc,
  rates
})

export default portfolio
export { portfolioZero }
export { portfolioBtc }
export { addressesMeta }
