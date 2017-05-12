/**
 * @module {can-map} models/sellOrder SellOrder
 * @parent models.auth
 *
 * Sell Orders of the Order Book
 *
 * @group models/sellOrder.properties 0 properties
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

const SellOrder = DefineMap.extend('SellOrder', {
  /**
   * @property {String} models/sellOrder.properties._id _id
   * @parent models/sellOrder.properties
   * Id prop
   */
  _id: 'string',
  /**
   * @property {Number} models/sellOrder.properties.quantity quantity
   * @parent models/sellOrder.properties
   * Quantity
   */
  quantity: 'number',
  /**
   * @property {Number} models/sellOrder.properties.price price
   * @parent models/sellOrder.properties
   * Price
   */
  price: 'number',
  /**
   * @property {Date} models/sellOrder.properties.date date
   * @parent models/sellOrder.properties
   * Date of the order
   */
  date: 'date',
  /**
   * @property {Boolean} models/sellOrder.properties.partial partial
   * @parent models/sellOrder.properties
   * Whether the order allows partial fills
   */
  partial: 'boolean'
});

SellOrder.List = DefineList.extend('SellOrderList', {
  '#': SellOrder
});

SellOrder.connection = superModel({
  Map: SellOrder,
  List: SellOrder.List,
  feathersService: feathersClient.service('/sell-order'),
  name: 'sellOrder',
  algebra
});

SellOrder.algebra = algebra;

export default SellOrder;
