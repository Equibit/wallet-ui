import feathersClient from '~/models/feathers-client'

const cachedPromises = {}
const refreshTimeout = 5 * 60 * 1000

function refreshFromService (symbol) {
  if (!cachedPromises[symbol]) {
    cachedPromises[symbol] = feathersClient.service('/bitcoin-average').find({query: { action: 'ticker', symbol }})
    cachedPromises[symbol].then(
      setTimeout(() => {
        cachedPromises[symbol] = null
      }, refreshTimeout),
      () => { cachedPromises[symbol] = null }
    )
  }
  return cachedPromises[symbol]
}

export default {
  convertBTCToUSD (btc) {
    return refreshFromService('BTCUSD').then(b => btc * b.averages.day)
  },
  convertUSDToBTC (usd) {
    return refreshFromService('BTCUSD').then(b => usd / b.averages.day)
  },
  convertMicroBTCToUSD (btc) {
    return refreshFromService('BTCUSD').then(b => btc * b.averages.day / 1000000)
  },
  convertUSDToMicroBTC (usd) {
    return refreshFromService('BTCUSD').then(b => usd * 1000000 / b.averages.day)
  },
  convertMilliBTCToUSD (btc) {
    return refreshFromService('BTCUSD').then(b => btc * b.averages.day / 1000)
  },
  convertUSDToMilliBTC (usd) {
    return refreshFromService('BTCUSD').then(b => usd * 1000 / b.averages.day)
  },
  convert (value, conversionSymbol) {
    return refreshFromService(conversionSymbol).then(b => value / b.averages.day)
  }
}
