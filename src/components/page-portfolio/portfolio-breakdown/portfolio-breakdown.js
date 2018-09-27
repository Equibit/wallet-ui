/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-breakdown portfolio-breakdown
 * @parent components.portfolio
 *
 * A short description of the portfolio-breakdown component
 *
 * @signature `<portfolio-breakdown />`
 *
 * @link ../src/components/page-portfolio/portfolio-breakdown/portfolio-breakdown.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-breakdown/portfolio-breakdown.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import './portfolio-breakdown.less'
import view from './portfolio-breakdown.stache'

export const ViewModel = DefineMap.extend({
  balance: {
    type: '*'
  },
  dataColumns: {
    get () {
      return this.balance && new DefineList([
        new DefineList(['Cash', this.balance.cashTotal]),
        new DefineList(['Domest. Equity', this.balance.securities || 0]), // equityDomest
        new DefineList(['Domest. Bonds', this.balance.bondsDomest || 0]),
        new DefineList(['Int. Equity', this.balance.equityInt || 0]),
        new DefineList(['Int. Bonds', this.balance.bondsInt || 0])
      ])
    }
  },
  config: {
    value () {
      return {
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
        },
        onrendered: () => {
          // Manually reposition chart and legend:
          const chartArcs = document.querySelector('portfolio-breakdown .c3-chart-arcs')
          chartArcs && chartArcs.setAttribute('transform', 'translate(60,58)')
          document.querySelectorAll('portfolio-breakdown svg .c3-legend-item').forEach(a => a.setAttribute('transform', 'translate(20,0)'))
        }
      }
    }
  }
})

export default Component.extend({
  tag: 'portfolio-breakdown',
  ViewModel,
  view
})
