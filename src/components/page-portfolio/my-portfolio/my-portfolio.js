/**
 * @module {can.Component} wallet-ui/components/page-portfolio/my-portfolio my-portfolio
 * @parent components.portfolio
 *
 * A short description of the my-portfolio component
 *
 * @signature `<my-portfolio />`
 *
 * @link ../src/components/page-portfolio/my-portfolio.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/my-portfolio.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './my-portfolio.less';
import view from './my-portfolio.stache';

export const ViewModel = DefineMap.extend({
  portfolio: {
    value: {
      balance: 22.616393,
      totalCash: 12.616393,
      totalSec: 10.00045,
      unrealizedPL: 0.109,
      unrealizedPLPercent: 1.2
    }
  },
  isSendFundsPopup: 'boolean',
  isReceiveFundsPopup: 'boolean',
  receiveFunds () {
    this.receiveFundsPopup = false;
    this.receiveFundsPopup = true;
  }
});

export default Component.extend({
  tag: 'my-portfolio',
  ViewModel,
  view
});
