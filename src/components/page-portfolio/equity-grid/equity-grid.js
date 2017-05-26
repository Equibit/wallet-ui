/**
 * @module {can.Component} wallet-ui/components/page-portfolio/equity-grid equity-grid
 * @parent components.grids
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
import PortfolioSecurity from '~/models/portfolio-security';
import Pagination from '~/models/pagination';

// TODO: turn fixtures off
import '~/models/fixtures/securities';

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 10
    })
  },
  rows: {
    get (value, resolve) {
      PortfolioSecurity.getList(this.queryParams).then(rows => {
        if (rows.total || rows.count) {
          this.pagination.total = rows.total || rows.count;
        }
        resolve(rows);
      });
    }
  },
  queryParams: {
    get () {
      let params = this.pagination.params;
      return Object.assign({securityType: 'equity'}, params);
    }
  }
});

export default Component.extend({
  tag: 'equity-grid',
  ViewModel,
  view
});
