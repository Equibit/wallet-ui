/**
 * @module {can.Component} components/trade-funds/place-order/order-confirm place-order > order-confirm
 * @parent components.buy-sell 3
 *
 * This component shows the summary of the data entered via the `<order-form>`.
 *
 * @signature `<order/confirm />`
 *
 * @link ../src/components/trade-funds/place-order/order-confirm/order-confirm.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-order/order-confirm/order-confirm.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './order-confirm.less'
import view from './order-confirm.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the order/confirm component'
  }
})

export default Component.extend({
  tag: 'order-confirm',
  ViewModel,
  view
})
