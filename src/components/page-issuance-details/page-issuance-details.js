import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-issuance-details.less';
import view from './page-issuance-details.stache';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  issuance: {
    value: new Issuance({
      issuanceName: 'Series 1',
      issuanceType: 'Common Shares',
      restriction: '1',
      volume24h: 1541,

      sharesAuthorized: 10000,
      sharesIssued: 8459,
      sharesDividend: 764,
      sharesDividendYield: 2.6,
    })
  }
});

export default Component.extend({
  tag: 'page-issuance-details',
  ViewModel,
  view
});
