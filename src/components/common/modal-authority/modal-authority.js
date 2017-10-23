/**
 * @module {can.Component} components/common/modal-authority modal-authority
 * @parent components.common
 *
 * A short description of the modal-authority component
 *
 * @signature `<modal-authority />`
 *
 * @link ../src/components/common/modal-authority/modal-authority.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/common/modal-authority/modal-authority.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './modal-authority.less'
import view from './modal-authority.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the modal-authority component'
  }
})

export default Component.extend({
  tag: 'modal-authority',
  ViewModel,
  view
})
