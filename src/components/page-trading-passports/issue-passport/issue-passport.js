/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/issue-passport issue-passport
 * @parent components.common
 *
 * A short description of the issue-passport component
 *
 * @signature `<issue-passport />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/issue-passport/issue-passport.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/issue-passport/issue-passport.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './issue-passport.less'
import view from './issue-passport.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the issue-passport component'
  },
  datepickerOptions: {
    type: '*',
    value () {
      return {
        viewMode: 'years',
        format: 'MM/DD/YYYY'
      }
    }
  }
})

export default Component.extend({
  tag: 'issue-passport',
  ViewModel,
  view
})

