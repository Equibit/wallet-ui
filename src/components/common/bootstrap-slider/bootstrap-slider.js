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

function updateSliderAttr (attr) {
  return function (val, resolve) {
    resolve(val)
    if (this.el) {
      const $el = $(this.el).find('input.slider')
      const slider = $el.data('slider')
      $el.slider('setAttribute', attr, val).slider('refresh')
      slider.on('change', ev => {
        this.valueHasChanged = true
        this.value = ev.newValue
        updateSliderTracking(slider, this)
      })
      updateSliderTracking(slider, this)
    }
  }
}

function updateSliderTracking (slider, vm) {
  slider.trackHigh.setAttribute('data-name', vm.formatValue(vm.maxValue - vm.value))
  slider.trackSelection.setAttribute('data-name', vm.formatValue(vm.value))
}

export const ViewModel = DefineMap.extend({
  seal: false
}, {
  type: {
    type: 'string',
    value: 'default'
  },
  minValue: {
    type: 'number',
    value: 0,
    set: updateSliderAttr('min')
  },
  maxValue: {
    type: 'number',
    value: 10,
    set: updateSliderAttr('max')
  },
  step: {
    type: 'number',
    value: 1,
    set: updateSliderAttr('step')
  },
  initialValue: {
    type: 'number',
    value: function () {
      return (this.minValue + this.maxValue) / 2
    },
    set: function (val, resolve) {
      if (this.valueHasChanged) {
        resolve(val)
      } else {
        updateSliderAttr('value').call(this, val, resolve)
      }
    }
  },
  value: {
    type: 'number',
    value: function () {
      return this.initialValue
    }
  },
  valueHasChanged: {
    type: 'boolean',
    value: false
  },
  formatValue (val) {
    return '' + val + (val === 1 ? ' hour' : ' hours')
  },
  el: '*'
})

export default Component.extend({
  tag: 'bootstrap-slider',
  ViewModel,
  view,
  events: {
    inserted: function (el, ev) {
      // console.log('options', this.viewModel.options)
      // const options = Object.assign(this.viewModel.defaultOptions, this.viewModel.options)
      this.viewModel.el = el
      const $el = $(el).find('input.slider')
      const slider = $el.slider().data('slider')
      slider.on('change', ev => {
        this.viewModel.valueHasChanged = true
        this.viewModel.value = ev.newValue
        updateSliderTracking(slider, this.viewModel)
      })
      this.viewModel.value = slider.getValue()
      updateSliderTracking(slider, this.viewModel)
    },
    removed: function (el, ev) {
      $(el).find('input.slider').slider('destroy')
    }
  }

})
