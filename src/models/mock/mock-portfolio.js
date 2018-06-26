import Portfolio from '../portfolio'
import hdNode from './mock-keys'
import listunspent, { listunspentZero, listunspentBtc, listunspentError } from './mock-listunspent'

import feathersClient from '../feathers-client'
feathersClient.service('portfolios').patch = () => Promise.resolve()

const addressesMeta = [
  // BTC:
  {index: 0, type: 'BTC', isUsed: true, isChange: false},   // n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA
  {index: 1, type: 'BTC', isUsed: true, isChange: false},   // mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA
  {index: 2, type: 'BTC', isUsed: false, isChange: false},  // mu2DDd2d9yDzS9PoqZrjD6e1ZnmgJnpv54

  // BTC change:
  {index: 0, type: 'BTC', isUsed: true, isChange: true},    // mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ
  {index: 1, type: 'BTC', isUsed: false, isChange: true},   // muJpBHeXzMGoFdUDTUanwwfZSG43Ec6zd8

  // EQB:
  {index: 0, type: 'EQB', isUsed: true, isChange: false},   // n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo
  {index: 1, type: 'EQB', isUsed: false, isChange: false},  // mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU

  // EQB change:
  {index: 0, type: 'EQB', isUsed: true, isChange: true}     // muMQ9mZjBy2E45QcWb1YZgD45mP3TfN3gC
]

const portfolioKeys = {
  BTC: hdNode.derivePath("m/44'/0'/0'"),
  EQB: hdNode.derivePath("m/44'/73'/0'")
}

const balance = {
  cashBtc: 1,
  cashEqb: 3,
  cashTotal: 4,
  securities: 6,
  total: 10
}

const portfolio = new Portfolio({
  _id: '595e5c58711b9e358f567edc',
  index: 0,
  name: 'My Portfolio',
  _addressesMeta: addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspent
})
// Note: `portfolio.nextAddress()` makes a request and connection's real-time behavior requires the instance to be
// in the instanceStore, thus adding a reference to keep it there.
portfolio.constructor.connection.addInstanceReference(portfolio)
console.log('mock portfolio: ', portfolio)

const portfolioZero = new Portfolio({
  index: 0,
  name: 'My Portfolio Empty',
  _addressesMeta: addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspentZero
  // balance
})

const portfolioBtc = new Portfolio({
  index: 0,
  name: 'My Portfolio BTC',
  _addressesMeta: addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspentBtc,
  balance
})

const portfolioDisconnected = new Portfolio({
  index: 0,
  name: 'My Portfolio Disconnected',
  _addressesMeta: addressesMeta,
  keys: portfolioKeys,
  utxoByTypeByAddress: listunspentError
  // balance
})

export default portfolio
export { portfolioZero }
export { portfolioBtc }
export { portfolioDisconnected }
export { addressesMeta }
