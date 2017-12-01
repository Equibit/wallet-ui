import stache from 'can-stache'
import accounting from 'accounting'
import moment from 'moment'
import { toMaxPrecision, localCurrency } from '../formatter'

stache.registerHelper('format', function (value, symbol, precision = 2) {
  return accounting.formatMoney(value, symbol, precision)
})

stache.registerHelper('format-max', function (value, precision = 2) {
  return toMaxPrecision(value, precision)
})

// 1.2345678 BTC => 1234.5678 mBTC
stache.registerHelper('format-milli', function (value) {
  return toMaxPrecision(value * 1000, 5)
})

// 1.2345678 BTC => 1234567.8 uBTC
stache.registerHelper('format-micro', function (value) {
  return toMaxPrecision(value * 1000 * 1000, 2)
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
stache.registerHelper('local-currency', function (value, type = 'BTC') {
  return localCurrency(value, type)
})

stache.registerHelper('local-currency-symbol', function () {
  return 'USD'
})

// Satoshi to Bitcoins
stache.registerHelper('coin', function (value, precision) {
  if (typeof precision !== 'number') {
    precision = 8
  }
  return toMaxPrecision(value / 100000000, precision)
})

// Satoshi to user selected units
stache.registerHelper('btc-user-units', function (value, precision) {
  if (typeof precision !== 'number') {
    precision = 2
  }
  // todo: use unit selector here.
  return toMaxPrecision(value / 100000000, precision)
})
