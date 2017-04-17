/**
 * @module {can.Component} components/page-issuances page-issuances
 * @parent components.pages
 *
 * Page Issuances
 *
 * @signature `<page-issuances />`
 *
 * @link ../src/components/page-issuances/page-issuances.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuances/page-issuances.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import './page-issuances.less';
import view from './page-issuances.stache';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  rows: {
    value () {
      Issuance.getList().then(rows => {
        this.rows = rows;
      });
      return new DefineList([]);
    }
  },
  selectedRow: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'page-issuances',
  ViewModel,
  view
});
