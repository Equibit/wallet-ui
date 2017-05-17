/**
 * @module {can-map} models/portfolioSummary PortfolioSummary
 * @parent models.auth
 *
 * Portfolio Summary model
 *
 * @group models/portfolioSummary.properties 0 properties
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

// TODO: FIXTURES ON!
import '~/models/fixtures/portfolio-summary';

const PortfolioSummary = DefineMap.extend('PortfolioSummary', {
  /**
   * @property {String} models/portfolioSummary.properties._id _id
   * @parent models/portfolioSummary.properties
   * Id prop
   */
  _id: 'string',
  balance: 'number',
  totalCash: 'number',
  totalSec: 'number',
  unrealizedPL: 'number',
  unrealizedPLPercent: 'number',
  companiesMnt: 'number',
  tradesMnt: 'number'
});

PortfolioSummary.List = DefineList.extend('PortfolioSummaryList', {
  '#': PortfolioSummary
});

PortfolioSummary.connection = superModel({
  Map: PortfolioSummary,
  List: PortfolioSummary.List,
  feathersService: feathersClient.service('/portfolio-summary'),
  name: 'portfoliosummary',
  algebra
});

PortfolioSummary.algebra = algebra;

export default PortfolioSummary;
