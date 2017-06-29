/**
 * @module {can.Component} components/page-issuances/company-metadata company-metadata
 * @parent components.issuances
 *
 * @link ../src/components/page-issuances/company-metadata/company-metadata.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuances/company-metadata/company-metadata.html
 *
**/

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './company-metadata.less'
import view from './company-metadata.stache'

export const ViewModel = DefineMap.extend({
  issuance: {
    type: '*',
    value: {}
  },
  currency: 'string'
})

export default Component.extend({
  tag: 'company-metadata',
  ViewModel,
  view
})
