/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls issuance-polls
 * @parent components.common
 *
 * A short description of the issuance-polls component
 *
 * @signature `<issuance-polls />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/issuance-polls.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/issuance-polls.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issuance-polls.less'
import view from './issuance-polls.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issuance-polls component'
  }
})

export default Component.extend({
  tag: 'issuance-polls',
  ViewModel,
  view
})
