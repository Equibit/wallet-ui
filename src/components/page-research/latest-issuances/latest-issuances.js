/**
 * @module {can.Component} wallet-ui/components/page-research/latest-issuances latest-issuances
 * @parent components.common
 *
 * A short description of the latest-issuances component
 *
 * @signature `<latest-issuances />`
 *
 * @link ../src/wallet-ui/components/page-research/latest-issuances.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-research/latest-issuances.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './latest-issuances.less';
import view from './latest-issuances.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the latest-issuances component'
  }
});

export default Component.extend({
  tag: 'latest-issuances',
  ViewModel,
  view
});
