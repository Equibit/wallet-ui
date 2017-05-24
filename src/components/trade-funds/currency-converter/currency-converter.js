/**
 * @module {can.Component} wallet-ui/components/trade-funds/currency-converter currency-converter
 * @parent components.common
 *
 * A short description of the currency-converter component
 *
 * @signature `<currency-converter />`
 *
 * @link ../src/wallet-ui/components/trade-funds/currency-converter.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/currency-converter.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './currency-converter.less';
import view from './currency-converter.stache';
import accounting from 'accounting';

const Currency = DefineMap.extend({
  rate: 'number',
  precision: {
    type: 'number',
    value: 2
  },
  symbol: 'string'
});

export const ViewModel = DefineMap.extend({
  currency: {
    Type: Currency,
    value: new Currency({ rate: 1.5, symbol: 'USD' })
  },
  inputVal: {
    type: '*'
  },
  output: {
    type: '*',
    set (val) {
      this.inputVal = accounting.unformat(val) / this.currency.rate;
      return val;
    },
    get () {
      return accounting.formatMoney(this.inputVal * this.currency.rate, '', this.precision);
    }
  }
});

export default Component.extend({
  tag: 'currency-converter',
  ViewModel,
  view
});

export { Currency };
