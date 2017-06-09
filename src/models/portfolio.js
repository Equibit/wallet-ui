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

  /**
   * @property {String} models/portfolio.properties.addresses addresses
   * @parent models/portfolio.properties
   * Tracking addresses by index for one-time usage.
   * ```
   * {
   *   eqb: {
   *     0: {used: true},
   *     1: {used: false}
   *   },
   *   btc: {
   *     0: {used: false}
   *   }
   * }
   * ```
   */
  // TODO: consider to simplify structure using hd path: `{"m'/44'/0/0/0": {used: true}}`
  addresses: {
    // TODO: update when service gets implemented.
    // serialize: true,
    type: '*',
    value: {
      btc: {},
      eqb: {}
    }
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
      const btcAddr = getNextAddressIndex(this.addresses, 'btc');
      const eqbAddr = getNextAddressIndex(this.addresses, 'eqb');
      const addr = {
        btc: this.keys.btc.derive(0).derive(btcAddr.index).getAddress(),
        eqb: this.keys.eqb.derive(0).derive(eqbAddr.index).getAddress()
      };
      if (btcAddr.imported === false) {
        // Import addr as watch-only
        this.importAddr(addr.btc);
        // Mark address as generated/imported but not used yet:
        this.addresses.btc[btcAddr.index] = {used: false};
      }
      if (eqbAddr.imported === false) {
        // Import addr as watch-only
        this.importAddr(addr.eqb);
        // Mark address as generated/imported but not used yet:
        this.addresses.eqb[eqbAddr.index] = {used: false};
      }

      return addr;
    }
  },

  // Methods:
  /**
   * @function models/portfolio.properties.importAddr importAddr
   * @parent models/portfolio.properties
   * Imports the given address to the built-in wallet (to become watch-only for registering transactions).
   */
  importAddr (addr) {
    // TODO: replace with a specific service (e.g. /import-address).
    feathersClient.service('proxycore').find({
      query: {
        method: 'importaddress',
        params: [addr]
      }
    }).then(res => {
      if (!res.error) {
        console.log('The address was imported successfully', res);
      } else {
        console.error('There was an error when I tried to import your address: ', res);
      }
    });
  }
});

function getNextAddressIndex (addresses = {}, type) {
  const addrByType = addresses[type] || {};
  return Object.keys(addrByType).reduce((acc, i) => {
    return addrByType[i].used !== true ? {index: Number(i), imported: true} : {index: Number(i) + 1, imported: false};
  }, {index: 0, imported: false});
}

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
export { getNextAddressIndex };

// Import an address to be added as watch-only to the built-in wallet:
// http://localhost:3030/proxycore?method=importaddress&params[]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32

// List unspent TOs for given addresses:
// http://localhost:3030/proxycore?method=listunspent&params[0]=0&params[1]=99999&params[2][]=mp9GiieHrLQvLu4C8nE9bbwxNmXqcC3nVf&params[2][]=mwd7FgMkm9yfPmNTnntsRbugZS7BEZaf32
