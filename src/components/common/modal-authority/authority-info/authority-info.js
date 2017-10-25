/**
 * @module {can.Component} wallet-ui/components/common/modal-authority/authority-info authority-info
 * @parent components.common
 *
 * A short description of the authority-info component
 *
 * @signature `<authority-info />`
 *
 * @link ../src/wallet-ui/components/common/modal-authority/authority-info/authority-info.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/common/modal-authority/authority-info/authority-info.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './authority-info.less'
import view from './authority-info.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the authority-info component'
  }
})

export default Component.extend({
  tag: 'authority-info',
  ViewModel,
  view
})
