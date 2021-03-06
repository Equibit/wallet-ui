/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-toolbar portfolio-toolbar
 * @parent components.portfolio
 *
 * A short description of the portfolio-toolbar component
 *
 * @signature `<portfolio-toolbar />`
 *
 * @link ../src/components/page-portfolio/portfolio-toolbar/portfolio-toolbar.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-toolbar/portfolio-toolbar.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './portfolio-toolbar.less'
import view from './portfolio-toolbar.stache'

export const ViewModel = DefineMap.extend({
  balance: 'number',
  sendFundsPopup: 'boolean',
  showFirstModal: '*',
  isSending: 'boolean',
  isSyncingBalance: 'boolean',
  sendFunds () {
    this.sendFundsPopup = false
    this.sendFundsPopup = true
  },
  receiveFunds: '*'
})

export default Component.extend({
  tag: 'portfolio-toolbar',
  ViewModel,
  view
})
