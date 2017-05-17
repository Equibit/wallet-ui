/**
 * @module {can.Component} components/market-depth market-depth
 * @parent components.common
 *
 * Issuance Details / Market Depth
 *
 * @signature `<market-depth />`
 *
 * @link ../src/components/page-issuance-details/market-depth/market-depth.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/market-depth/market-depth.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './market-depth.less';
import view from './market-depth.stache';
import MarketDepth from '~/models/market-depth';

export const ViewModel = DefineMap.extend({
  dataPromise: {
    value: MarketDepth.get({})
  },
  chartData: {
    get (lastVal, resolve) {
      this.dataPromise.then(data => {
        resolve({
          x: 'x',
          type: 'area-spline',
          columns: data.c3Data
        });
      });
    }
  },
  config: {
    get () {
      return Object.assign({}, this.configOpt, { data: this.chartData });
    }
  },
  configOpt: {
    type: '*',
    value: {
      color: {
        pattern: ['#32B576', '#EC2F39']
      },
      height: 30,
      axis: {
        x: {
          type: 'category',
          tick: {
            count: 5,
            multiline: false
          },
          padding1: {
            left: 0
          }
        },
        y: {
          tick: {
            count: 4,
            format: (d) => Math.floor(d)
          },
          padding: {
            top: 0,
            bottom: 0
          }
        }
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      },
      size: {
        height: 140
      },
      padding: {
        left: 30,
        right: 10,
        bottom: 10
      },
      tooltip: {
        position: function (data, width, height, element) {
          let top = data.length > 1 ? 25 - height : -height;
          let left = parseInt(element.getAttribute('x')) - 30;
          return { top, left };
        }
      }
    }
  }
});

export default Component.extend({
  tag: 'market-depth',
  ViewModel,
  view
});
