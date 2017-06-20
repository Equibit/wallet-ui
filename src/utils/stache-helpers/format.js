import stache from 'can-stache';
import accounting from 'accounting';
import moment from 'moment';
import { toMaxPrecision } from '../formatter';
import Session from '~/models/session';

stache.registerHelper('format', function (value, symbol, precision = 2) {
  return accounting.formatMoney(value, symbol, precision);
});

stache.registerHelper('format-max', function (value, precision = 2) {
  return toMaxPrecision(value, precision);
});

// 1.2345678 BTC => 1234.5678 mBTC
stache.registerHelper('format-milli', function (value) {
  return toMaxPrecision(value * 1000, 5);
});

// 1.2345678 BTC => 1234567.8 uBTC
stache.registerHelper('format-micro', function (value) {
  return toMaxPrecision(value * 1000 * 1000, 2);
});

stache.registerHelper('format-int', function (value) {
  return accounting.formatNumber(value);
});

stache.registerHelper('format-time', function (value) {
  let m = moment(value);
  let isToday = m.isSame(moment(), 'day');
  return isToday ? m.format('hh:mma') : m.format('MM/DD');
});

stache.registerHelper('format-date-full', function (value) {
  return moment(value).format('MM/DD/YY @ hh:mm A');
});

stache.registerHelper('format-date-short', function (value) {
  return moment(value).format('MM/DD/YY');
});

stache.registerHelper('local-currency', function (value, type = 'BTC') {
  const rates = Session.current && Session.current.rates;
  return accounting.formatMoney(value * rates[type === 'BTC' ? 'btcToUsd' : 'eqbToUsd'], '', 2);
});

stache.registerHelper('local-currency-symbol', function () {
  return 'USD';
});
