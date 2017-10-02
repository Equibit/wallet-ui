/**
 * @module {can-map} models/marketDepth MarketDepth
 * @parent models.auth
 *
 * Market Depth chart
 *
 * @group models/marketDepth.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import superModel from './super-model'
import algebra from './algebra'

// TODO: FIXTURES ON!
import '~/models/fixtures/market-depth'

const MarketDepth = DefineMap.extend('MarketDepth', {
  /**
   * @property {String} models/marketDepth.properties._id _id
   * @parent models/marketDepth.properties
   * Id prop
   */
  _id: 'string',
  /**
   * @property {Array} models/marketDepth.properties.asks asks
   * @parent models/marketDepth.properties
   * Asks data
   */
  asks: '*',
  /**
   * @property {Array} models/marketDepth.properties.bids bids
   * @parent models/marketDepth.properties
   * Bids data
   */
  bids: '*',
  /**
   * @property {Array} models/marketDepth.properties.cats cats
   * @parent models/marketDepth.properties
   * Categories for x-axis
   */
  cats: '*',
  get c3Data () {
    return [
      ['x'].concat(this.cats),
      ['asks'].concat(this.asks),
      ['bids'].concat(this.bids)
    ]
  }
})

MarketDepth.List = DefineList.extend('MarketDepthList', {
  '#': MarketDepth
})

MarketDepth.connection = superModel({
  Map: MarketDepth,
  List: MarketDepth.List,
  feathersService: feathersClient.service('/market-depth'),
  name: 'marketdepth',
  algebra
})

MarketDepth.algebra = algebra

export default MarketDepth
