/**
 * @module {can-map} models/candlestick Candlestick
 * @parent models
 *
 * User model
 *
 * @group models/candlestick.properties 0 properties
 * @group models/candlestick.prototype 1 prototype
 * @group models/candlestick.static 2 static
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import superModel from './super-model'
import feathersClient from './feathers-client'
import algebra from './algebra'

// FIXTURES!!!
import '~/models/fixtures/candlestick'

const Candlestick = DefineMap.extend('Candlestick', {
  /**
   * @property {String} models/candlestick.properties.date date
   * @parent models/candlestick.properties
   * Date timestamp, in seconds.
   */
  'date': 'number',
  'high': 'number',
  'low': 'number',
  'open': 'number',
  'close': 'number',
  'volume': 'number',
  'quoteVolume': 'number',
  'weightedAverage': 'number'
})

Candlestick.List = DefineList.extend('CandlestickList', {
  '#': Candlestick
})

Candlestick.connection = superModel({
  Map: Candlestick,
  List: Candlestick.List,
  feathersService: feathersClient.service('/candlestick'),
  name: 'users',
  algebra
})

Candlestick.algebra = algebra

export default Candlestick
