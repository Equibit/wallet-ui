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
import './page-issuances.less';
import view from './page-issuances.stache';

export const ViewModel = DefineMap.extend({
  selectedRow: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'page-issuances',
  ViewModel,
  view
});
