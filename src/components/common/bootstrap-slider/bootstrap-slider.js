/**
 * @module {can.Component} wallet-ui/components/common/bootstrap-slider bootstrap-slider
 * @parent components.common
 *
 * A short description of the bootstrap-slider component
 *
 * @signature `<bootstrap-slider />`
 *
 * @link ../src/wallet-ui/components/common/bootstrap-slider/bootstrap-slider.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/bootstrap-slider/bootstrap-slider.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './bootstrap-slider.less'
import view from './bootstrap-slider.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the bootstrap-slider component'
  }
})

export default Component.extend({
  tag: 'bootstrap-slider',
  ViewModel,
  view
})
