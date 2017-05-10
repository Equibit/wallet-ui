import stache from 'can-stache';
import accounting from 'accounting';

stache.registerHelper('format', function (value, symbol, precision = 2) {
  return accounting.formatMoney(value, symbol, precision);
});

stache.registerHelper('format-int', function (value) {
  return accounting.formatNumber(value);
});
