import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-orders.less'
import view from './page-orders.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-orders component'
  }
})

export default Component.extend({
  tag: 'page-orders',
  ViewModel,
  view
})
