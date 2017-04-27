/**
 * @module {can.Component} components/issuance-passports issuance-passports
 * @parent components.common
 *
 * Issuance Passports
 *
 * @signature `<issuance-passports {passports}="passports" {user-passports}="userPassports" />`
 *
 * @link ../src/components/page-issuance-details/issuance-passports/issuance-passports.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/issuance-passports/issuance-passports.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import './issuance-passports.less';
import view from './issuance-passports.stache';
import _ from 'lodash';

export const ViewModel = DefineMap.extend({
  passports: {
    value: new DefineList([
      { name: 'Issuer Direct' },
      { name: 'Investor ID Services' },
      { name: 'Investor ABD Lorem' },
      { name: 'Abc Lorem Ipsum' },
      { name: 'Abc Lorem Ipsum' },
      { name: 'Abc Lorem Ipsum' },
      { name: 'Abc Lorem Ipsum' },
      { name: 'Dolor Sit Amet' },
      { name: 'Dolor Sit Amet' }
    ])
  },
  userPassports: {
    value: []
  },
  get visiblePassports () {
    return this.passports.length > 8 ? _.take(this.passports, 7) : this.passports;
  }
});

export default Component.extend({
  tag: 'issuance-passports',
  ViewModel,
  view
});
