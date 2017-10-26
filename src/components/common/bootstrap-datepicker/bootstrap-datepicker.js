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
  options: '*'
})

export default Component.extend({
  tag: 'bootstrap-datepicker',
  ViewModel,
  view,
  events: {
    inserted: function (el, ev) {
      // console.log('options', this.viewModel.options)
      $(el).find('[datetimepicker]').datetimepicker(this.viewModel.options)
    },
    removed: function (el, ev) {
      $(el).find('[datetimepicker]').datetimepicker('destroy')
    }
  }
})
