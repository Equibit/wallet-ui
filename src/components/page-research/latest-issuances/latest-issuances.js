/**
 * @module {can.Component} wallet-ui/components/page-research/latest-issuances latest-issuances
 * @parent components.common
 *
 * A short description of the latest-issuances component
 *
 * @signature `<latest-issuances />`
 *
 * @link ../src/components/page-research/latest-issuances.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/latest-issuances.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './latest-issuances.less';
import view from './latest-issuances.stache';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  rowsPromise: {
    type: '*'
  },
  rows: {
    get (val, resolve) {
      if (val) {
        return val;
      }
      this.rowsPromise = Issuance.getList({$limit: 10, $skip: 0}).then(resolve);
    }
  }
});

export default Component.extend({
  tag: 'latest-issuances',
  ViewModel,
  view
});
