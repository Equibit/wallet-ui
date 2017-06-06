/**
 * @module {can-map} models/portfolio Portfolio
 * @parent models.auth
 *
 * Portfolio model
 *
 * @group models/portfolio.properties 0 properties
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

// TODO: FIXTURES ON!
import '~/models/fixtures/portfolio';

const Portfolio = DefineMap.extend('Portfolio', {
  /**
   * @property {String} models/portfolio.properties._id _id
   * @parent models/portfolio.properties
   * Id prop
   */
  _id: 'string',
  index: 'number',
  balance: 'number',
  totalCash: 'number',
  totalSecurities: 'number',
  unrealizedPL: 'number',
  unrealizedPLPercent: 'number',
  companiesMnt: 'number',
  tradesMnt: 'number',
  keys: {
    type: '*',
    serialize: false
  }
});

Portfolio.List = DefineList.extend('PortfolioList', {
  '#': Portfolio
});

Portfolio.connection = superModel({
  Map: Portfolio,
  List: Portfolio.List,
  feathersService: feathersClient.service('/portfolios'),
  name: 'portfolio',
  algebra
});

Portfolio.algebra = algebra;

export default Portfolio;
