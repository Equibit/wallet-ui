/**
 * @module {can.Component} components/common/barchart bar-chart
 * @parent components.generic 1
 *
 * A short description of the bar-chart component
 *
 * @signature `<bar-chart />`
 *
 * @link ../src/components/common/barchart/barchart.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/barchart/barchart.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './barchart.less'
import view from './barchart.stache'

export const ViewModel = DefineMap.extend({
  dataColumns: {
    type: '*'
  },
  type: {
    type: 'string'
  },
  config: {
    type: '*',
    value: {
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: -25,
            multiline: false
          },
          height: 30,
          padding: {
            left: 0.5
          }
        },
        y: {
          label: {
            text: 'Price (BTC)',
            position: 'inner-top'
          }
        }
      },
      color: {
        pattern: ['#32B576', '#468CD9', '#FFBC5E', '#EC2F39']
      }
    }
  },
  axisX: {
    type: '*'
  }
})

export default Component.extend({
  tag: 'bar-chart',
  ViewModel,
  view
})
