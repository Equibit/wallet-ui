/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/passport-owned-accepted-issuances-grid passport-owned-accepted-issuances-grid
 * @parent components.common
 *
 * A short description of the passport-owned-accepted-issuances-grid component
 *
 * @signature `<passport-owned-accepted-issuances-grid />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/passport-owned-accepted-issuances-grid/passport-owned-accepted-issuances-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/passport-owned-accepted-issuances-grid/passport-owned-accepted-issuances-grid.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './passport-owned-accepted-issuances-grid.less'
import view from './passport-owned-accepted-issuances-grid.stache'

export const ViewModel = DefineMap.extend({
  rowsPromise: {
    get () {
      return Promise.resolve([])
    }
  },
  rows: {
    get (lastSetVal, resolve) {
      this.rowsPromise.then(rows => {
        resolve && resolve(rows)
      })
    }
  }
})

export default Component.extend({
  tag: 'passport-owned-accepted-issuances-grid',
  ViewModel,
  view
})
