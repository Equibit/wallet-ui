/**
 * @module {can.Component} components/page-issuances page-issuances
 * @parent components.pages
 *
 * Page Issuances
 *
 * @signature `<page-issuances />`
 *
 * @link ../src/components/page-issuances/page-issuances.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuances/page-issuances.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-issuances.less'
import view from './page-issuances.stache'
import route from 'can-route'

export const ViewModel = DefineMap.extend({
  selectedRow: {
    type: '*'
  },
  sort: {
    set (val) {
      route.data.sort = val === 1 ? 'asc' : 'desc'
      return val
    },
    get () {
      return route.data.sort === 'asc'
        ? 1
        : (route.data.sort === 'desc' ? -1 : undefined)
    }
  }
})

export default Component.extend({
  tag: 'page-issuances',
  ViewModel,
  view
})
