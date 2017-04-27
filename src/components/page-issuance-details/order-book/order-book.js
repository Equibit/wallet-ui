/**
 * @module {can.Component} components/order-book order-book
 * @parent components.common
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
  message: {
    value: 'This is the order-book component'
  }
});

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
});
