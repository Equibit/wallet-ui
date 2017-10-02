/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-cash portfolio-cash
 * @parent components.portfolio
 *
 * A short description of the portfolio-cash component
 *
 * @signature `<portfolio-cash />`
 *
 * @link ../src/components/page-portfolio/portfolio-cash/portfolio-cash.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-cash/portfolio-cash.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './portfolio-cash.less'
import view from './portfolio-cash.stache'
import Session from '~/models/session'

export const ViewModel = DefineMap.extend({
  balance: {
    type: '*'
  },
  cashEqbInBtc: {
    get () {
      return this.balance && this.balance.cashEqb * Session.current.rates.eqbToBtc
    }
  }
})

export default Component.extend({
  tag: 'portfolio-cash',
  ViewModel,
  view
})
