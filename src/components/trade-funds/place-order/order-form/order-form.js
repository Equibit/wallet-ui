/**
 * @module {can.Component} components/trade-funds/place-order/order-form place-order > order-form
 * @parent components.buy-sell 2
 *
 * This component shows the forms used to place a buy or sell order.
 *
 * @signature `<order-form />`
 *
 * @link ../src/components/trade-funds/place-order/order-form/order-form.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-order/order-form/order-form.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './order-form.less'
import view from './order-form.stache'

export const ViewModel = DefineMap.extend({
  formData: '*',
  issuance: '*',
  switchType (type) {
    this.formData.type = type
  }
})

export default Component.extend({
  tag: 'order-form',
  ViewModel,
  view
})
