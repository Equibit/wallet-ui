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
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap-slider'

export const ViewModel = DefineMap.extend({
  type: {
    type: 'string',
    value: 'default'
  },
  minValue: {
    type: 'number',
    value: 0
  },
  maxValue: {
    type: 'number',
    value: 10
  },
  initialValue: {
    type: 'number',
    value: function () {
      return (this.minValue + this.maxValue) / 2
    }
  },
  value: {
    type: 'number'
  }
})

export default Component.extend({
  tag: 'bootstrap-slider',
  ViewModel,
  view,
  events: {
    inserted: function (el, ev) {
      // console.log('options', this.viewModel.options)
      //const options = Object.assign(this.viewModel.defaultOptions, this.viewModel.options)

      $(el).find('input.slider').slider()
    },
    removed: function (el, ev) {
      $(el).find('input.slider').slider('destroy')
    }
  }

})
