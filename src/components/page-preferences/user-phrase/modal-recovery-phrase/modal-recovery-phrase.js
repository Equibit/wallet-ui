/**
 * @module {can.Component} components/page-preferences/user-phrase/modal-recovery-phrase user-phrase > modal-recovery-phrase
 * @parent components.user-preferences
 *
 * Show the flow to view the user's recovery phrase.
 *
 * @signature `<modal-recovery-phrase />`
 *
 * @link ../src/components/page-preferences/user-phrase/modal-recovery-phrase/modal-recovery-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-preferences/user-phrase/modal-recovery-phrase/modal-recovery-phrase.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './modal-recovery-phrase.less'
import view from './modal-recovery-phrase.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'intro'
  },
  intro () {
    this.mode = 'intro'
  },
  view () {
    this.mode = 'view'
  },
  edit () {
    this.mode = 'edit'
  },
  end () {
    this.mode = 'end'
  },
  risk () {
    this.mode = 'risk'
  }
})

export default Component.extend({
  tag: 'modal-recovery-phrase',
  ViewModel,
  view
})
