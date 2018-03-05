/**
 * @module {can.Component} components/trade-funds/place-offer/offer-confirm place-offer > offer-confirm
 * @parent components.buy-sell-offers 2
 *
 * This component shows the summary of the data entered via the `<offer-form>`.
 *
 * @signature `<offer-confirm />`
 *
 * @link ../src/components/trade-funds/place-offer/offer-confirm/offer-confirm.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-offer/offer-confirm/offer-confirm.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './offer-confirm.less'
import view from './offer-confirm.stache'
import currencyConverter from '~/utils/currency-converter'

export const ViewModel = DefineMap.extend({
  formData: '*',
  convertToUSD: function (value) {
    if (this.formData.order.type === 'SELL') {
      // A BUY offer to a SELL order will send funds in BTC
      return currencyConverter.convertToUserFiat.apply(null, arguments)
    } else {
      // A SELL offer to a BUY order will send shares
      return currencyConverter.convertToUserFiat(value, 'EQB', currencyConverter.satoshi)
    }
  }
})

export default Component.extend({
  tag: 'offer-confirm',
  ViewModel,
  view
})
