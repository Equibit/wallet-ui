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
import currencyConverter from '~/utils/currency-converter'

export const ViewModel = DefineMap.extend({
  balance: {
    type: '*'
  },
  eqbError: {
    type: 'boolean'
  },
  btcError: {
    type: 'boolean'
  },
  loaded: {
    type: 'boolean'
  },
  blankEqbInBtc: {
    get (val, resolve) {
      currencyConverter.convertCryptoToCrypto(this.balance.blankEqb, 'EQB', 'BTC').then(resolve)
    }
  }
})

export default Component.extend({
  tag: 'portfolio-cash',
  ViewModel,
  view
})
