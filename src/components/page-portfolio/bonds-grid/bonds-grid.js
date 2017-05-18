/**
 * @module {can.Component} wallet-ui/components/page-portfolio/bonds-grid bonds-grid
 * @parent components.common
 *
 * A short description of the bonds-grid component
 *
 * @signature `<bonds-grid />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/bonds-grid.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/bonds-grid.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './bonds-grid.less';
import view from './bonds-grid.stache';
import Issuance from '~/models/issuance';

export const ViewModel = DefineMap.extend({
  rows: {
    get (value, resolve) {
      Issuance.getList({}).then(rows => {
        resolve(rows);
      });
    }
  },
});

export default Component.extend({
  tag: 'bonds-grid',
  ViewModel,
  view
});
