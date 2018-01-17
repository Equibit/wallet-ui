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
  step: {
    type: 'number',
    value: 1
  },
  initialValue: {
    type: 'number',
    value: function () {
      return (this.minValue + this.maxValue) / 2
    }
  },
  value: {
    type: 'number',
    value: function () {
      return this.initialValue
    }
  },
  formatValue (val) {
    return '' + val + (val === 1 ? ' hour' : ' hours')
  }
})

export default Component.extend({
  tag: 'bootstrap-slider',
  ViewModel,
  view,
  events: {
    inserted: function (el, ev) {
      // console.log('options', this.viewModel.options)
      // const options = Object.assign(this.viewModel.defaultOptions, this.viewModel.options)

      const slider = $(el).find('input.slider').slider().data('slider')
      slider.on('change', ev => {
        this.viewModel.value = ev.newValue
        slider.trackHigh.setAttribute('data-name', this.viewModel.formatValue(this.viewModel.maxValue - this.viewModel.value))
        slider.trackSelection.setAttribute('data-name', this.viewModel.formatValue(this.viewModel.value))
      })
      this.viewModel.value = slider.getValue()
      slider.trackHigh.setAttribute('data-name', this.viewModel.formatValue(this.viewModel.maxValue - this.viewModel.value))
      slider.trackSelection.setAttribute('data-name', this.viewModel.formatValue(this.viewModel.value))
    },
    removed: function (el, ev) {
      $(el).find('input.slider').slider('destroy')
    }
  }

})
