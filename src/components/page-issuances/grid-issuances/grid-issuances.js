import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import './grid-issuances.less';
import view from './grid-issuances.stache';
import Pagination from '~/models/pagination';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  pagination: {
    value: new Pagination({
      skip: 0,
      limit: 10
    })
  },
  rows: {
    get (value, resolve) {
      if (value) {
        return value;
      }
      Issuance.getList(this.pagination.params).then(rows => {
        this.pagination.total = rows.total;
        resolve(rows);
      });
    }
  },
  selectedRow: {
    type: '*'
  },
  loadPage: function (){
    Issuance.getList(this.pagination.params).then(items => {
      this.rows = items;
    });
  }
});

export default Component.extend({
  tag: 'grid-issuances',
  ViewModel,
  view
});
