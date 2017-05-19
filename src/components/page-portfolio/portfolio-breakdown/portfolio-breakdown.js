/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-breakdown portfolio-breakdown
 * @parent components.common
 *
 * A short description of the portfolio-breakdown component
 *
 * @signature `<portfolio-breakdown />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/portfolio-breakdown.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/portfolio-breakdown.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import './portfolio-breakdown.less';
import view from './portfolio-breakdown.stache';

export const ViewModel = DefineMap.extend({
  dataColumns: {
    value: new DefineList([
      new DefineList(['Cash', 35]),
      new DefineList(['Domest. Equity', 10]),
      new DefineList(['Domest. Bonds', 20]),
      new DefineList(['Int. Equity', 15]),
      new DefineList(['Int. Bonds', 20])
    ])
  },
  config: {
    value: {
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
        document.querySelector('portfolio-breakdown .c3-chart-arcs').setAttribute('transform', 'translate(60,58)');
        document.querySelectorAll('portfolio-breakdown svg .c3-legend-item').forEach(a => a.setAttribute('transform', 'translate(20,0)'));
      }
    }
  }
});

export default Component.extend({
  tag: 'portfolio-breakdown',
  ViewModel,
  view
});
