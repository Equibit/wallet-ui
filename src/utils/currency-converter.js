import feathersClient from '~/models/feathers-client'
import Observation from 'can-observation'
import canEvent from 'can-event'
import CID from 'can-cid'
import Session from '~/models/session'
import canSymbol from 'can-symbol'

const cachedPromises = {}
const refreshTimeout = 5 * 60 * 1000

function refreshFromService (symbol) {
  Observation.add(exports, symbol)
  if (!cachedPromises[symbol]) {
    cachedPromises[symbol] = feathersClient.service('/bitcoin-average').find({ query: { action: 'ticker', symbol } })
    cachedPromises[symbol].then(value => {
      if (value && value.averages) {
        exports.dispatch(symbol, [value.averages.day])
      }
      setTimeout(() => {
        cachedPromises[symbol] = null
      }, refreshTimeout)
    },
    () => {
      cachedPromises[symbol] = null
    })
  }
  return cachedPromises[symbol]
}

// CurrencyRate = DefineMap.extend({ symbol: enum (BTCUSD | BTCCAD | ...), value: 'number'})
// CurrencyRate.getList({}) //{query: {symbol: $in: [BTCUSD, BTCCAD, ...]}}
const satoshiSymbol = canSymbol('satoshi')
const microSymbol = canSymbol('micro')
const milliSymbol = canSymbol('milli')
const unitSymbol = canSymbol('unit')

const scalars = {
  [satoshiSymbol]: 100000000,
  [microSymbol]: 1000000,
  [milliSymbol]: 1000,
  [unitSymbol]: 1
}

const injectedRates = {}

const exports = {
  satoshi: satoshiSymbol,
  horlacher: satoshiSymbol,
  micro: microSymbol,
  milli: milliSymbol,
  unit: unitSymbol,
  m: milliSymbol,
  u: microSymbol,
  µ: microSymbol,
  1: unitSymbol,
  getDailyAverage (symbol) {
    if (typeof injectedRates[symbol] !== 'undefined') {
      Observation.add(exports, symbol)
      return Promise.resolve(injectedRates[symbol])
    } else {
      return refreshFromService(symbol).then(b => (b.averages && b.averages.day))
    }
  },
  convertCryptoToFiat (value, conversionSymbol, scaleSymbol = exports.unit) {
    return exports.getDailyAverage(conversionSymbol)
      .then(b => value * b / scalars[scaleSymbol])
      .catch(() => 0)
  },
  convertFiatToCrypto (value, conversionSymbol, scaleSymbol = exports.unit) {
    return exports.getDailyAverage(conversionSymbol)
      .then(b => value / b * scalars[scaleSymbol])
      .catch(() => 0)
  },
  convertToUserFiat (value, symbol, scaleSymbol) {
    if (!Session || !Session.fiatCurrency) {
      console.log('** convertToUserFiat: typeof Session: ' + typeof Session)
      console.log('** convertToUserFiat: typeof Session.fiatCurrency: ' + typeof Session.fiatCurrency)
    }
    const fiatCurrency = (Session && Session.fiatCurrency && Session.fiatCurrency()) || 'USD'
    return exports.convertCryptoToFiat(value, symbol + fiatCurrency, scaleSymbol)
  },
  convertFromUserFiat (value, symbol, scaleSymbol) {
    if (!Session || !Session.fiatCurrency) {
      console.log('** convertFromUserFiat: typeof Session: ' + typeof Session)
      console.log('** convertFromUserFiat: typeof Session.fiatCurrency: ' + typeof Session.fiatCurrency)
    }
    const fiatCurrency = (Session && Session.fiatCurrency && Session.fiatCurrency()) || 'USD'
    return exports.convertFiatToCrypto(value, symbol + fiatCurrency, scaleSymbol)
  },
  convertCryptoToCrypto (value, fromSymbol, toSymbol, fromScale = exports.unit, toScale = exports.unit) {
    return exports.convertToUserFiat(value, fromSymbol, fromScale)
      .then(fiat => exports.convertFromUserFiat(fiat, toSymbol, toScale))
  },
  // TODO steal-remove this function once the injection of EQBUSD is no longer needed
  // This function is for testing and also lets us stub out EQB until the external service
  //  starts serving averages for it.
  injectRates (rates) {
    Object.keys(rates).forEach(symbol => {
      injectedRates[symbol] = rates[symbol]
      exports.dispatch(symbol, [rates[symbol]])
    })
  }
}
CID(exports)
Object.assign(exports, canEvent)

// TODO remove this once EQB is listed on BitcoinAverage
exports.injectRates({
  EQBUSD: 1000
})

export default exports
export let {
  satoshi,
  horlacher,
  micro,
  milli,
  unit,
  m,
  u,
  µ,
  getDailyAverage,
  convertCryptoToFiat,
  convertFiatToCrypto,
  convertToUserFiat,
  convertFromUserFiat,
  convertCryptoToCrypto,
  // TODO steal-remove this function once the injection of EQBUSD is no longer needed
  // This function is for testing and also lets us stub out EQB until the external service
  //  starts serving averages for it.
  injectRates
} = exports
