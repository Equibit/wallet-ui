/**
 * @module {can.Component} components/common/modal-company modal-company
 * @parent components.common
 *
 * Shows the information of a company
 *
 * @signature `<modal-company />`
 *
 * @link ../src/components/common/modal-company/modal-company.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/modal-company/modal-company.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './modal-company.less'
import view from './modal-company.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the modal-company component'
  }
})

export default Component.extend({
  tag: 'modal-company',
  ViewModel,
  view
})
