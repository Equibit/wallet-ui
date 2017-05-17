/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-summary portfolio-summary
 * @parent components.common
 *
 * A short description of the portfolio-summary component
 *
 * @signature `<portfolio-summary />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/portfolio-summary.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/portfolio-summary.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './portfolio-summary.less';
import view from './portfolio-summary.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the portfolio-summary component'
  }
});

export default Component.extend({
  tag: 'portfolio-summary',
  ViewModel,
  view
});
