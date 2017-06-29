/**
 * @module {can-map} models/marketCap MarketCap
 * @parent models.auth
 *
 * Market Capitalization chart for last 24 hours
 *
 * @group models/marketCap.properties 0 properties
 */

import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'

// TODO: FIXTURES ON!
import '~/models/fixtures/market-cap'

const MarketCap = DefineMap.extend('MarketCap', {
  /**
   * @property {String} models/marketCap.properties._id _id
   * @parent models/marketCap.properties
   * Id prop
   */
  _id: 'string',
  /**
   * @property {String} models/marketCap.properties.companyName companyName
   * @parent models/marketCap.properties
   * Company name
   */
  companyName: 'string',
  get companyNameDisplay () {
    return this.companyName.length > 15 ? this.companyName.substr(0, 12) + '...' : this.companyName
  },
  /**
   * @property {Number} models/marketCap.properties.price price
   * @parent models/marketCap.properties
   * Price
   */
  price: 'number'
})

MarketCap.List = DefineList.extend('MarketCapList', {
  '#': MarketCap,
  get barChart () {
    if (!this.length) {
      return
    }
    return [].reduce.call(this, (acc, el) => {
      acc.labels.push(el.companyNameDisplay)
      acc.values[0].push(el.price)
      return acc
    }, {labels: ['x'], values: [['MarketCap']]})
  }
})

MarketCap.connection = superModel({
  Map: MarketCap,
  List: MarketCap.List,
  feathersService: feathersClient.service('/market-cap'),
  name: 'marketcap',
  algebra
})

MarketCap.algebra = algebra

export default MarketCap
