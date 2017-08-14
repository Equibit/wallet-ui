/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance create-issuance
 * @parent components.common
 *
 * A short description of the create-issuance component
 *
 * @signature `<create-issuance />`
 *
 * @link ../src/components/page-my-issuances/create-issuance/create-issuance.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/create-issuance.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './create-issuance.less'
import view from './create-issuance.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'edit'
  },
  next () {
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  create (close) {
    this.dispatch('create', [{}])
    close()
  }
})

export default Component.extend({
  tag: 'create-issuance',
  ViewModel,
  view
})
