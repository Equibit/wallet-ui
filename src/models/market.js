/**
 * @module {can-map} models/market Market
 * @parent models.auth
 *
 * Market Summary for last 24 hours
 *
 * @group models/market.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import superModel from './super-model'
import algebra from './algebra'

// TODO: FIXTURES ON!
import { data } from './fixtures/market'

const Market = DefineMap.extend('Market', {
  _id: 'string',
  /**
   * @property {Number} models/market.properties.newIssuances newIssuances
   * @parent models/market.properties
   * Number of new issuances
   */
  newIssuances: 'number',
  /**
   * @property {Number} models/market.properties.volume volume
   * @parent models/market.properties
   * Volume in BTC
   */
  volume: 'number',
  /**
   * @property {Number} models/market.properties.tradesNum tradesNum
   * @parent models/market.properties
   * Number of trades
   */
  tradesNum: 'number',
  /**
   * @property {Number} models/market.properties.shareVolume shareVolume
   * @parent models/market.properties
   * Volume of shares in EQB
   */
  shareVolume: 'number',

  // Blank EQB stats here (similar to issuance stats):// DAVID
  lowestAskEqb: 'number',
  lowestNumSharesEqb: 'number',
  highestBidEqb: 'number',
  highestNumSharesEqb: 'number'
})

Market.List = DefineList.extend('MarketList', {
  '#': Market
})

Market.connection = superModel({
  Map: Market,
  List: Market.List,
  feathersService: feathersClient.service('/market'),
  name: 'market',
  algebra
})

Market.algebra = algebra

// todo: remove this FIXTURE:
Market.get = () => {
  return Promise.resolve(new Market(data))
}

export default Market
