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
import Session from '~/models/session';

// TODO: FIXTURES ON!
// import '~/models/fixtures/portfolio';

const Portfolio = DefineMap.extend('Portfolio', {
  '*': {
    serialize: false
  },

  /**
   * @property {String} models/portfolio.properties._id _id
   * @parent models/portfolio.properties
   * Id prop
   */
  _id: {
    serialize: true,
    type: 'string'
  },
  /**
   * @property {String} models/portfolio.properties.name name
   * @parent models/portfolio.properties
   * Name of the portfolio. Default: My Portfolio.
   */
  name: {
    serialize: true,
    type: 'string'
  },

  index: 'number',
  balance: {type: 'number', value: 0},
  totalCash: {type: 'number', value: 0},
  totalSecurities: {type: 'number', value: 0},
  unrealizedPL: {type: 'number', value: 0},
  unrealizedPLPercent: {type: 'number', value: 0},
  createdAt: 'date',
  updatedAt: 'date',
  userId: 'string',
  keys: {
    get () {
      if (Session.current && Session.current.user && typeof this.index !== 'undefined') {
        return Session.current.user.generatePortfolioKeys(this.index);
      }
    }
  },
  // "m /44' /0' /portfolio-index' /0 /index"
  nextAddress: {
    get () {
      // TODO: check this.addresses and return the last unused address.
      return {
        btc: this.keys.btc.derive(0).derive(0).getAddress(),
        eqb: this.keys.eqb.derive(0).derive(0).getAddress()
      }
    }
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
