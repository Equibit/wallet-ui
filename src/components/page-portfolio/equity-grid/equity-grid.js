/**
 * @module {can.Component} wallet-ui/components/page-portfolio/equity-grid equity-grid
 * @parent components.common
 *
 * A short description of the equity-grid component
 *
 * @signature `<equity-grid />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/equity-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/equity-grid.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './equity-grid.less';
import view from './equity-grid.stache';
import Issuance from '~/models/issuance';
import Pagination from '~/models/pagination';

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 10
    })
  },
  rows: {
    set (value) {
      if (value && value[0]) {
        setTimeout(() => {
          this.selectRowDefault(value[0]);
        }, 0);
      }
      return value;
    },
    get (value, resolve) {
      if (value) {
        return value;
      }
      Issuance.getList(this.queryParams).then(rows => {
        if (rows.total) {
          this.pagination.total = rows.total;
        }
        resolve(rows);
        this.selectRowDefault(rows[0]);
      });
    }
  },
  selectedRow: {
    type: '*'
  },
  sort: {
    type: '*'
  },
  queryParams: {
    get () {
      let params = this.pagination.params;
      if (typeof this.sort !== 'undefined') {
        params['$sort'] = {
          change: this.sort
        };
      }
      return params;
    }
  }
});

export default Component.extend({
  tag: 'equity-grid',
  ViewModel,
  view
});
