/**
 * @module {can.Component} wallet-ui/components/page-research/most-active most-active
 * @parent components.common
 *
 * A short description of the most-active component
 *
 * @signature `<most-active />`
 *
 * @link ../src/wallet-ui/components/page-research/most-active.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-research/most-active.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './most-active.less';
import view from './most-active.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the most-active component'
  }
});

export default Component.extend({
  tag: 'most-active',
  ViewModel,
  view
});
