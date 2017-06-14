import stache from 'can-stache';
import accounting from 'accounting';
import moment from 'moment';
import { toMaxPrecision } from '../formatter';

stache.registerHelper('format', function (value, symbol, precision = 2) {
  return accounting.formatMoney(value, symbol, precision);
});

stache.registerHelper('format-max', function (value, precision = 2) {
  return toMaxPrecision(value, precision);
});

stache.registerHelper('format-int', function (value) {
  return accounting.formatNumber(value);
});

stache.registerHelper('format-time', function (value) {
  let m = moment(value);
  let isToday = m.isSame(moment(), 'day');
  return isToday ? m.format('hh:mma') : m.format('MM/DD');
});
