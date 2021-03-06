/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/owned-passport-details owned-passport-details
 * @parent components.common
 *
 * A short description of the owned-passport-details component
 *
 * @signature `<owned-passport-details />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/owned-passport-details/owned-passport-details.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/owned-passport-details/owned-passport-details.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './owned-passport-details.less'
import view from './owned-passport-details.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'ISSUANCES'
  },
  passport: '*'
})

export default Component.extend({
  tag: 'owned-passport-details',
  ViewModel,
  view
})
