/**
 * @module {can.Component} wallet-ui/components/trade-funds/currency-converter currency-converter
 * @parent components.common 3
 *
 * Input field that converts the given input according to the given currency rate.
 *
 * @signature `<currency-converter />`
 *
 *  Template:
 *  ```
 *  <can-import from="~/components/trade-funds/currency-converter/" />
 *  <input {($value)}="val" type="number" />
 *  <currency-converter {(input)}="val" {currency}="currency" />
 *  ```
 *  View model data:
 *  ```
 *  {
 *      input: 250,
 *      currency: {
 *          rate: 10.5,
 *          symbol: 'USD'
 *      }
 *  }
 *  ```
 *
 * @link ../src/components/trade-funds/currency-converter/currency-converter.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/currency-converter/currency-converter.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './currency-converter.less'
import view from './currency-converter.stache'
import accounting from 'accounting'

const Currency = DefineMap.extend({
  rate: 'number',
  precision: {
    type: 'number',
    value: 2
  },
  symbol: 'string'
})

export const ViewModel = DefineMap.extend({
  currency: Currency,
  input: {
    type: '*'
  },
  outputFormatted: {
    type: '*',
    set (val) {
      this.input = accounting.unformat(val) / this.currency.rate
      return val
    },
    get () {
      return accounting.formatMoney(this.input * (this.currency ? this.currency.rate : 0), '', this.precision)
    }
  },
  get output () {
    return accounting.unformat(this.outputFormatted)
  }
})

export default Component.extend({
  tag: 'currency-converter',
  ViewModel,
  view
})

export { Currency }
