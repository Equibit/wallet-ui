import accounting from 'accounting'
import Session from '../models/session'

export function toMaxPrecision (val, precision) {
  const factor = Math.pow(10, precision)
  return Math.round(val * factor) / factor
}

const tmpRates = {
  btcToUsd: 5000,
  eqbToUsd: 1000,
  eqbToBtc: 1000 / 5000,
  securitiesToBtc: 1 / 5
}

export function localCurrency (value, type = 'BTC', precision = 2) {
  const rates = Session.current && Session.current.rates || tmpRates
  if (!rates) {
    console.warn('No currency rates available.')
    return value
  }
  const rateType = type === 'BTC'
    ? 'btcToUsd'
    : (type === 'SECURITIES' ? 'securitiesToBtc' : 'eqbToUsd')
  return accounting.formatMoney(value / 100000000 * rates[rateType], '', precision)
}
