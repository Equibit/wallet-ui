/**
 * @module {can.Component} wallet-ui/components/trade-funds/place-offer/offer-form place-offer > offer-form
 * @parent components.buy-sell-offers 1
 *
 * This component shows the forms used to place a buy or sell offer.
 *
 * @signature `<offer-form />`
 *
 * @link ../src/components/trade-funds/place-offer/offer-form/offer-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-offer/offer-form/offer-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './offer-form.less'
import view from './offer-form.stache'

export const ViewModel = DefineMap.extend({
  formData: '*',
  order: '*',
})

export default Component.extend({
  tag: 'offer-form',
  ViewModel,
  view
})
