/**
 * @module {can.Component} wallet-ui/components/page-portfolio/equity-grid/cancel-securities cancel-securities
 * @parent components.portfolio
 *
 * A short description of the cancel-securities component
 *
 * @signature `<cancel-securities />`
 *
 * @link ../src/components/page-portfolio/equity-grid/cancel-securities/cancel-securities.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/equity-grid/cancel-securities/cancel-securities.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './cancel-securities.less'
import view from './cancel-securities.stache'
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
  tag: 'cancel-securities',
  ViewModel,
  view
})
