/**
 * @module {can.Component} wallet-ui/components/page-research/biggest-movers-grid biggest-movers-grid
 * @parent components.grids
 *
 * A short description of the biggest-movers-grid component
 *
 * @signature `<biggest-movers-grid />`
 *
 * @link ../src/components/page-research/biggest-movers-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-research/biggest-movers-grid.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import './biggest-movers-grid.less';
import view from './biggest-movers-grid.stache';

// TODO: turn OFF the FIXTURES
import '~/models/fixtures/biggest-movers';

export const ViewModel = DefineMap.extend({
  model: {
    type: '*'
  },
  sort: 'string',
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
        this.rowsPromise = this.model.getList({
          $sort: { change: (this.sort === 'asc' ? '1' : -1) },
          $limit: 5,
          $skip: 0
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
