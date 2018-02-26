import { uniq } from 'ramda'

import feathersClient from './feathers-client'

/**
 * @function models/portfolio.properties.importAddr importAddr
 * @parent models/portfolio.properties
 * Imports the given address to the built-in wallet (to become watch-only for registering transactions).
 */
const importAddr = (addr, currencyType, rescan) => {
  // TODO: replace with a specific service (e.g. /import-address).
  return feathersClient.service('proxycore').find({
    query: {
      node: currencyType.toLowerCase(),
      method: 'importaddress',
      params: [addr, '', !!rescan]
    }
  }).then(res => {
    if (!res.error) {
      console.log('The address was imported successfully', res)
    } else {
      console.error('There was an error when I tried to import your address: ', res)
    }
  })
}

const importMulti = (addresses, type, alreadyImportedAddresses) => {
  if (alreadyImportedAddresses) {
    addresses = addresses.filter(address => {
      return !alreadyImportedAddresses.includes(address)
    })
    alreadyImportedAddresses.push.apply(alreadyImportedAddresses, addresses)
  }
  if (!addresses.length) {
    return Promise.resolve(true)
  }
  return feathersClient.service('importmulti').create({
    addresses,
    type
  }).then(res => {
    return true
  })
}

const fetchListunspent = ({ BTC = [], EQB = [] }) => {
  return feathersClient.service('/listunspent').find({
    // GET query params are lower cased:
    query: {
      btc: uniq(BTC),
      eqb: uniq(EQB),
      byaddress: true
    }
  })
}

const getNextAddressIndex = (addresses = [], type, isChange = false) => {
  return addresses.filter(a => a.type === type && a.isChange === isChange).reduce((acc, a) => {
    return a.isUsed !== true ? {index: a.index, imported: true} : {index: a.index + 1, imported: false}
  }, {index: 0, imported: false})
}

// function getPoftfolioBalance (balance, addresses) {
//   return addresses.reduce((acc, address) => (balance[address] ? acc + balance[address].amount : acc), 0);
// }

const getUnspentOutputsForAmount = (txouts, amount) => {
  return txouts.reduce((acc, a) => {
    if (a.amount >= amount &&
      (acc.txouts.length > 1 ||
      (acc.txouts.length === 1 &&
      (acc.txouts[0].amount < amount || a.amount < acc.txouts[0].amount)))
    ) {
      return {sum: a.amount, txouts: [a]}
    }
    if (acc.sum >= amount) {
      return acc
    }
    acc.sum += a.amount
    acc.txouts.push(a)
    return acc
  }, {sum: 0, txouts: []})
}

const getAllUtxo = (addresses) => {
  return Object.keys(addresses).reduce((acc, addr) => {
    acc.push.apply(acc, addresses[addr].txouts)
    return acc
  }, [])
}

export default {
  importAddr,
  importMulti,
  fetchListunspent,
  getNextAddressIndex,
  getUnspentOutputsForAmount,
  getAllUtxo
}

export function filterUniqAddr (list) {
  return list.reduce((acc, item) => {
    const key = `${item.portfolioId}-${item.index}-${item.type}-${item.isChange}`
    if (!acc.map[key]) {
      acc.map[key] = true
      acc.res.push(item)
    }
    return acc
  }, {res: [], map: {}}).res
}

export function containAddress (list, item) {
  return list.reduce((acc, a) => {
    return acc || (
      item.portfolioId === a.portfolioId &&
      item.index === a.index &&
      item.type === a.type &&
      item.isChange === a.isChange
    )
  }, false)
}
