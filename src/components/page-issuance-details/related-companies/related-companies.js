/**
 * @module {can.Component} components/related-companies related-companies
 * @parent components.issuances
 *
 * Shows companies with similar market an share price to an issuance.
 *
 * @signature `<related-companies />`
 *
 * @link ../src/components/page-issuance-details/related-companies/related-companies.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/related-companies/related-companies.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './related-companies.less';
import view from './related-companies.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the related-companies component'
  }
});

export default Component.extend({
  tag: 'related-companies',
  ViewModel,
  view
});
