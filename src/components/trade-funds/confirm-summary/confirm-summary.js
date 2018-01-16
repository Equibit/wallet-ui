/**
 * @module {can.Component} wallet-ui/components/trade-funds/confirm-summary confirm-summary
 * @parent components.buy-sell-offers
 *
 * A short description of the confirm-summary component
 *
 * @signature `<confirm-summary />`
 *
 * @link ../src/wallet-ui/components/trade-funds/confirm-summary/confirm-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/confirm-summary/confirm-summary.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './confirm-summary.less'
import view from './confirm-summary.stache'
import currencyConverter from '~/utils/btc-usd-converter'

export const ViewModel = DefineMap.extend({
  formData: '*',
  convertToUSD: function (value) {
    if (this.formData.type === 'BUY') {
      return currencyConverter.convertMicroBTCToUSD.apply(null, arguments)
    } else {
      return currencyConverter.convert(value, 'EQBUSD')
    }
  }
})

export default Component.extend({
  tag: 'confirm-summary',
  ViewModel,
  view
})
