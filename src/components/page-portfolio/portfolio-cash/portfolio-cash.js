/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-cash portfolio-cash
 * @parent components.portfolio
 *
 * A short description of the portfolio-cash component
 *
 * @signature `<portfolio-cash />`
 *
 * @link ../src/components/page-portfolio/portfolio-cash/portfolio-cash.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/portfolio-cash/portfolio-cash.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './portfolio-cash.less';
import view from './portfolio-cash.stache';

export const ViewModel = DefineMap.extend({
  balance: {
    type: '*'
  }
});

export default Component.extend({
  tag: 'portfolio-cash',
  ViewModel,
  view
});
