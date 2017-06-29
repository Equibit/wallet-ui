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
import DefineMap from 'can-define/map/'
import './offer-confirm.less'
import view from './offer-confirm.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the offer-confirm component'
  }
})

export default Component.extend({
  tag: 'offer-confirm',
  ViewModel,
  view
})
