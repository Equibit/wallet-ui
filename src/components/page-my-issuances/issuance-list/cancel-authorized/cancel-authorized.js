/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/issuances-list/cancel-authorized cancel-authorized
 * @parent components.issuances
 *
 * A short description of the cancel-authorized component
 *
 * @signature `<cancel-authorized />`
 *
 * @link ../src/components/page-my-issuances/issuances-list/cancel-authorized/cancel-authorized.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-my-issuances/issuances-list/cancel-authorized/cancel-authorized.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './cancel-authorized.less'
import view from './cancel-authorized.stache'
// import Session from '../../../models/session'

export const ViewModel = DefineMap.extend({
  cancelIssuance: '*',
  cancelFn: '*',
  isCanceling: {
    value: false
  },
  cancel (close) {
    this.isCanceling = true
    this.cancelFn(this.cancelIssuance)
      .then(() => {
        this.isCanceling = false
        close()
      })
      .catch(err => {
        this.isCanceling = false
        close()
        throw err
      })
  }
})

export default Component.extend({
  tag: 'cancel-authorized',
  ViewModel,
  view
})
