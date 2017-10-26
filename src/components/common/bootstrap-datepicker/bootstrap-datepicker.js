/**
 * @module {can.Component} wallet-ui/components/common/bootstrap-datepicker bootstrap-datepicker
 * @parent components.common
 *
 * A short description of the bootstrap-datepicker component
 *
 * @signature `<bootstrap-datepicker />`
 *
 * @link ../src/wallet-ui/components/common/bootstrap-datepicker/bootstrap-datepicker.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/bootstrap-datepicker/bootstrap-datepicker.html
 */

import $ from 'jquery'
import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './bootstrap-datepicker.less'
import view from './bootstrap-datepicker.stache'

export const ViewModel = DefineMap.extend({
  defaultOptions: {
    type: '*',
    value () {
      return {
        icons: {
          time: "icon icon-clock",
          date: "icon icon-calendar",
          up: "icon icon-chevron rotate-270",
          down: "icon icon-chevron rotate-90",
          previous: 'icon icon-chevron rotate-180',
          next: 'icon icon-chevron',
        }
      }
    }
  },
  options: '*'
})

export default Component.extend({
  tag: 'bootstrap-datepicker',
  ViewModel,
  view,
  events: {
    inserted: function (el, ev) {
      // console.log('options', this.viewModel.options)
      const options = Object.assign(this.viewModel.defaultOptions, this.viewModel.options)

      $(el).find('[datetimepicker]').datetimepicker(options)
    },
    removed: function (el, ev) {
      $(el).find('[datetimepicker]').datetimepicker('destroy')
    }
  }
})
