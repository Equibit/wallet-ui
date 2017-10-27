/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-messages/sent-messages-grid sent-messages-grid
 * @parent components.common
 *
 * A short description of the sent-messages-grid component
 *
 * @signature `<sent-messages-grid />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-messages/sent-messages-grid/sent-messages-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-messages/sent-messages-grid/sent-messages-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './sent-messages-grid.less'
import view from './sent-messages-grid.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the sent-messages-grid component'
  }
})

export default Component.extend({
  tag: 'sent-messages-grid',
  ViewModel,
  view
})
