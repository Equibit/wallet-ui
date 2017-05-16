/**
 * @module {can-map} models/marketDepth MarketDepth
 * @parent models.auth
 *
 * Market Depth chart
 *
 * @group models/marketDepth.properties 0 properties
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

// TODO: FIXTURES ON!
import '~/models/fixtures/market-depth';

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
  asks: 'string',
  /**
   * @property {Array} models/marketDepth.properties.bids bids
   * @parent models/marketDepth.properties
   * Bids data
   */
  bids: 'number'
});

MarketDepth.List = DefineList.extend('MarketDepthList', {
  '#': MarketDepth
});

MarketDepth.connection = superModel({
  Map: MarketDepth,
  List: MarketDepth.List,
  feathersService: feathersClient.service('/market-depth'),
  name: 'marketdepth',
  algebra
});

MarketDepth.algebra = algebra;

export default MarketDepth;
