/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-messages/compose-message compose-message
 * @parent components.common
 *
 * A short description of the compose-message component
 *
 * @signature `<compose-message />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-messages/compose-message/compose-message.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-messages/compose-message/compose-message.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './compose-message.less'
import view from './compose-message.stache'

export const ViewModel = DefineMap.extend({
  config: {
    type: '*',
    value () {
      return {
        toolbar: [
          // [groupName, [list of button]]
          ['font', ['fontname', 'fontsize']],
          ['fontstyle', ['bold', 'italic', 'underline', 'clear', 'quote']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['insert', ['table', 'link', 'hr']],
          ['misc', ['undo', 'redo']]
        ]
      }
    }
  }
})

export default Component.extend({
  tag: 'compose-message',
  ViewModel,
  view
})
