import accounting from 'accounting'
import Session from '~/models/session'
import currencyConverter from '~/utils/currency-converter'

export function toMaxPrecision (val, precision) {
  const factor = Math.pow(10, precision)
  return Math.round(val * factor) / factor
}

const tmpRates = {
  securitiesToBtc: 1 / 5
}
function setup () {
  // Circular dependency to Session, so in case it's not loaded yet
  if (typeof Session !== 'undefined' && Session.fiatCurrency) {
    tmpRates['BTC' + Session.fiatCurrency] = 10000
    tmpRates['EQB' + Session.fiatCurrency] = 1000

    // TODO make usage patterns for this formatter async so it can call currencyConverter functions directly
    currencyConverter.on('BTC' + Session.fiatCurrency, (ev, rate) => {
      tmpRates['BTC' + Session.fiatCurrency] = rate
    })
    currencyConverter.on('EQB' + Session.fiatCurrency, (ev, rate) => {
      tmpRates['EQB' + Session.fiatCurrency] = rate
    })
    currencyConverter.getDailyAverage('BTC' + Session.fiatCurrency).then(avg => {
      tmpRates['BTC' + Session.fiatCurrency] = avg
    })
    currencyConverter.getDailyAverage('EQB' + Session.fiatCurrency).then(avg => {
      tmpRates['EQB' + Session.fiatCurrency] = avg
    })
  } else {
    setTimeout(setup, 100)
  }
}
setup()

export function localCurrency (value, type = 'BTC', precision = 2) {
  const rates = tmpRates
  if (!rates) {
    console.warn('No currency rates available.')
    return value
  }
  // Circular dependency guard:
  if (!Session || !Session.fiatCurrency) {
    console.log('*** formatter.localCurrency: Session.fiatCurrency is not defined yet.')
    return value
  }
  const rateType = type === 'BTC'
    ? 'BTC' + Session.fiatCurrency
    : (type === 'SECURITIES' ? 'securitiesToBtc' : 'EQB' + Session.fiatCurrency)
  return accounting.formatMoney(value / 100000000 * rates[rateType], '', precision)
}
