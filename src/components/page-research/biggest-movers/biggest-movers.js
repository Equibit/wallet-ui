/**
 * @module {can.Component} wallet-ui/components/page-research/biggest-movers biggest-movers
 * @parent components.research
 *
 * A short description of the biggest-movers component
 *
 * @signature `<biggest-movers />`
 *
 * @link ../src/components/page-research/biggest-movers.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/biggest-movers.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './biggest-movers.less'
import view from './biggest-movers.stache'
import BiggestMovers from '../../../models/biggest-movers'

export const ViewModel = DefineMap.extend({
  BiggestMovers: {
    get () {
      return BiggestMovers
    }
  }
})

export default Component.extend({
  tag: 'biggest-movers',
  ViewModel,
  view
})
