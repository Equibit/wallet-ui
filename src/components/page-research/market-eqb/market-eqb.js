/**
 * @module {can.Component} wallet-ui/components/page-research/market-eqb market-eqb
 * @parent components.issuances
 *
 * A short description of the market-eqb component
 *
 * @signature `<market-eqb />`
 *
 * @link ../src/components/page-research/market-eqb.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/market-eqb.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './market-eqb.less'
import view from './market-eqb.stache'
import MarketCap from '~/models/market-cap'

export const ViewModel = DefineMap.extend({
  title: {
    type: 'string',
    default: 'EQB Market Capitalization'
  }
})

export default Component.extend({
  tag: 'market-eqb',
  ViewModel,
  view
})
