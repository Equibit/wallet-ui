/**
 * @module {can.Component} components/page-offers page-offers
 * @parent components.pages
 *
 * This is the page where buy and sell offers show.
 *
 * @signature `<page-offers />`
 *
 * @link ../src/components/page-offers/page-offers.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/page-offers.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-offers.less'
import view from './page-offers.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-offers component'
  }
})

export default Component.extend({
  tag: 'page-offers',
  ViewModel,
  view
})
