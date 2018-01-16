/**
 * @module {can.Component} wallet-ui/components/trade-funds/accept-offer accept-offer
 * @parent components.common
 *
 * A short description of the accept-offer component
 *
 * @signature `<accept-offer />`
 *
 * @link ../src/wallet-ui/components/trade-funds/accept-offer/accept-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/accept-offer/accept-offer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './accept-offer.less'
import view from './accept-offer.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the accept-offer component'
  }
})

export default Component.extend({
  tag: 'accept-offer',
  ViewModel,
  view
})
