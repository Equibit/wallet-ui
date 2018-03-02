import stache from 'can-stache'
import accounting from 'accounting'
import moment from 'moment'
import { toMaxPrecision, localCurrency } from '../formatter'
import Session from '~/models/session'

stache.registerHelper('format', function (value, symbol, precision) {
  if (typeof precision === 'undefined') {
    precision = 2
  }
  return accounting.formatMoney(value, symbol, precision)
})

stache.registerHelper('format-max', function (value, precision) {
  if (typeof precision === 'undefined') {
    precision = 2
  }
  return toMaxPrecision(value, precision)
})

// 1.2345678 BTC => 1234.5678 mBTC
stache.registerHelper('format-milli', function (value) {
  return toMaxPrecision(value * 1000, 5)
})

// 1.2345678 BTC => 1234567.8 uBTC
// Satoshi to uBTC
stache.registerHelper('format-micro', function (satoshi) {
  return toMaxPrecision(satoshi / 100, 2)
  // return toMaxPrecision(value * 1000 * 1000, 2)
})

stache.registerHelper('format-int', function (value) {
  return accounting.formatNumber(value)
})

stache.registerHelper('format-time', function (value) {
  let m = moment(value)
  let isToday = m.isSame(moment(), 'day')
  return isToday ? m.format('hh:mma') : m.format('MM/DD')
})

stache.registerHelper('format-date-full', function (value) {
  return moment(value).format('MM/DD/YY @ hh:mm A')
})

stache.registerHelper('format-date-short', function (value) {
  return moment(value).format('MM/DD/YY')
})

// Satoshi to local currency:
stache.registerHelper('local-currency', function (value, type) {
  if (!type) {
    type = 'BTC'
  }
  return localCurrency(value, type)
})
stache.registerHelper('local-currency-symbol', function () {
  return Session.fiatCurrency()
})

// Satoshi to Bitcoins
stache.registerHelper('coin', function (value, precision) {
  if (typeof precision !== 'number') {
    precision = 8
  }
  return toMaxPrecision(value / 100000000, precision)
})

// Satoshi to user selected units
stache.registerHelper('user-units', function (value, precision) {
  if (typeof precision !== 'number') {
    precision = 2
  }
  // todo: use unit selector here (from Session.current)
  return toMaxPrecision(value / 100000000, precision)
})
stache.registerHelper('user-units-symbol', function (value) {
  // todo: use unit selector here (from Session.current)
  return value === 'EQB' ? 'EQB' : 'BTC'
})
