/**
 * @module {can.Component} components/page-my-issuances/create-issuance/create-company create-company
 * @parent components.common
 *
 * Shows the form to create a company
 *
 * @signature `<create-company />`
 *
 * @link ../src/components/page-my-issuances/create-issuance/create-company/create-company.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-my-issuances/create-issuance/create-company/create-company.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-company.less'
import view from './create-company.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the create-company component'
  }
})

export default Component.extend({
  tag: 'create-company',
  ViewModel,
  view
})
