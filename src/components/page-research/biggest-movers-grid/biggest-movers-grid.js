/**
 * @module {can.Component} wallet-ui/components/page-research/biggest-movers-grid biggest-movers-grid
 * @parent components.common
 *
 * A short description of the biggest-movers-grid component
 *
 * @signature `<biggest-movers-grid />`
 *
 * @link ../src/wallet-ui/components/page-research/biggest-movers-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-research/biggest-movers-grid.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import './biggest-movers-grid.less';
import view from './biggest-movers-grid.stache';

export const ViewModel = DefineMap.extend({
  model: {
    type: '*'
  },
  sort: {
    set (val) {
      console.log('sort.set ' + val);
      return val === 'asc' ? 1 : -1;
    }
  },
  rowsPromise: {
    type: '*'
  },
  rows: {
    get (val, resolve) {
      if (val) {
        return val;
      }
      // Note: `this.model` can be set later than `this.rows`.
      if (this.model) {
        console.log('quering: ' + this.sort);
        this.rowsPromise = this.model.getList({
         // $sort: { change: this.sort }
        }).then(resolve);
      }
    }
  }
});

export default Component.extend({
  tag: 'biggest-movers-grid',
  ViewModel,
  view
});
