/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup send-popup
 * @parent components.common
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/wallet-ui/components/trade-funds/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/send-popup.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './send-popup.less';
import view from './send-popup.stache';

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'edit'
  },
  next () {
    this.mode = 'confirm';
  },
  edit () {
    this.mode = 'edit';
  }
});

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
});
