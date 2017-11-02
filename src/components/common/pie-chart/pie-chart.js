/**
 * @module {can.Component} wallet-ui/components/common/pie-chart pie-chart
 * @parent components.common
 *
 * A short description of the pie-chart component
 *
 * @signature `<pie-chart />`
 *
 * @link ../src/wallet-ui/components/common/pie-chart/pie-chart.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/pie-chart/pie-chart.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './pie-chart.less'
import view from './pie-chart.stache'

export const ViewModel = DefineMap.extend({
  // For data examples see http://bitovi-components.github.io/bit-c3/docs/bit-c3.examples.pie_chart.html
  dataColumns: {
    type: '*',
    set (val) {
      if (val && val.get) {
        val = val.get()
      }
      return val
    }
  },

  // Config options can be overriden:
  config: {
    type: '*',
    set (val) {
      if (val && val.get) {
        val = val.get()
      }
      return Object.assign({
        legend: {
          position: 'right'
        },
        color: {
          pattern: ['#EC2F39', '#FFBC5E', '#32B576', '#3ED2C8', '#468CD9']
        },
        size: {
          height: 120
        },
        donut: {
          label: {
            show: false
          }
        }
      }, val)
    }
  }

})

export default Component.extend({
  tag: 'pie-chart',
  ViewModel,
  view
})
