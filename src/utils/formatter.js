import accounting from 'accounting'
import Session from '../models/session'

export function toMaxPrecision (val, precision) {
  const factor = Math.pow(10, precision)
  return Math.round(val * factor) / factor
}

export function localCurrency (value, type = 'BTC', precision = 2) {
  const rates = Session.current && Session.current.rates
  if (!rates) {
    console.warn('No currency rates available.')
    return value
  }
  const rateType = type === 'BTC'
    ? 'btcToUsd'
    : (type === 'SECURITIES' ? 'securitiesToBtc' : 'eqbToUsd')
  return accounting.formatMoney(value / 100000000 * rates[rateType], '', precision)
}
