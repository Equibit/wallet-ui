/**
 * @module {can.Component} wallet-ui/components/page-issuance-details/issuance-polls/poll-results poll-results
 * @parent components.common
 *
 * A short description of the poll-results component
 *
 * @signature `<poll-results />`
 *
 * @link ../src/wallet-ui/components/page-issuance-details/issuance-polls/poll-results/poll-results.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-issuance-details/issuance-polls/poll-results/poll-results.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './poll-results.less'
import view from './poll-results.stache'

export const ViewModel = DefineMap.extend({
  
  dataColumns: [
    ["Ber Reeves", 100],
    ["Annie Potter", 80],
    ["Hope Conner", 70]
  ],

  // Config options can be overriden:
  config: {
    type: '*',
    set (val) {
      if (val && val.get) {
        val = val.get()
      }
      return Object.assign({
        size: {
          height: 180
        }
      }, val)
    }
  }

})

export default Component.extend({
  tag: 'poll-results',
  ViewModel,
  view
})
