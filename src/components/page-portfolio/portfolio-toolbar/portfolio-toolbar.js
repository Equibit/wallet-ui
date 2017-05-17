/**
 * @module {can.Component} wallet-ui/components/page-portfolio/portfolio-toolbar portfolio-toolbar
 * @parent components.common
 *
 * A short description of the portfolio-toolbar component
 *
 * @signature `<portfolio-toolbar />`
 *
 * @link ../src/wallet-ui/components/page-portfolio/portfolio-toolbar.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-portfolio/portfolio-toolbar.html
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './portfolio-toolbar.less';
import view from './portfolio-toolbar.stache';

export const ViewModel = DefineMap.extend({
  balance: 'number'
});

export default Component.extend({
  tag: 'portfolio-toolbar',
  ViewModel,
  view
});
