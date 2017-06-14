/**
 * @module {can.Component} components/order-book order-book
 * @parent components.issuance-details
 *
 * Issuance Details / Order Book
 *
 * @signature `<order-book />`
 *
 * @link ../src/components/page-issuance-details/order-book/order-book.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/order-book/order-book.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './order-book.less';
import view from './order-book.stache';

export const ViewModel = DefineMap.extend({
  issuance: {
    type: '*'
  },
  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false;
    this.isModalShown = true;
  }
});

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
});
