/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls/sent-polls-grid sent-polls-grid
 * @parent components.common
 *
 * A short description of the sent-polls-grid component
 *
 * @signature `<sent-polls-grid />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/sent-polls-grid/sent-polls-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/sent-polls-grid/sent-polls-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './sent-polls-grid.less'
import view from './sent-polls-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the sent-polls-grid component'
  }
})

export default Component.extend({
  tag: 'sent-polls-grid',
  ViewModel,
  view
})
