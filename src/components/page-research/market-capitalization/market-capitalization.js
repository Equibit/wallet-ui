/**
 * @module {can.Component} wallet-ui/components/page-research/market-capitalization market-capitalization
 * @parent components.issuances
 *
 * A short description of the market-capitalization component
 *
 * @signature `<market-capitalization />`
 *
 * @link ../src/components/page-research/market-capitalization.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/market-capitalization.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './market-capitalization.less'
import view from './market-capitalization.stache'
import MarketCap from '~/models/market-cap'

export const ViewModel = DefineMap.extend({
  dataPromise: {
    get () {
      return MarketCap.getList({}).then(a => {
        return a.barChart
      })
    }
  },
  dataColumns: {
    get (lastVal, resolve) {
      this.dataPromise.then(a => {
        resolve(a.values)
      })
    }
  },
  labels: {
    get (lastVal, resolve) {
      this.dataPromise.then(a => {
        resolve(a.labels)
      })
    }
  }
})

export default Component.extend({
  tag: 'market-capitalization',
  ViewModel,
  view
})
