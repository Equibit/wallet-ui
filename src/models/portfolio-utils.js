import feathersClient from './feathers-client'

/**
 * @function models/portfolio.properties.importAddr importAddr
 * @parent models/portfolio.properties
 * Imports the given address to the built-in wallet (to become watch-only for registering transactions).
 */
const importAddr = (addr, currencyType) => {
  // TODO: replace with a specific service (e.g. /import-address).
  feathersClient.service('proxycore').find({
    query: {
      node: currencyType.toLowerCase(),
      method: 'importaddress',
      params: [addr]
    }
  }).then(res => {
    if (!res.error) {
      console.log('The address was imported successfully', res)
    } else {
      console.error('There was an error when I tried to import your address: ', res)
    }
  })
}

const fetchBalance = (addr) => {
  return feathersClient.service('/listunspent').find({
    // GET query params are lower cased:
    query: {
      btc: addr.BTC,
      eqb: addr.EQB,
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
  }, {sum: 0, txouts: []}).txouts
}

export default {
  importAddr,
  fetchBalance,
  getNextAddressIndex,
  getUnspentOutputsForAmount
}