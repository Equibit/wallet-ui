/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-input phrase-input
 * @parent components.user-preferences
 *
 * Shows 4 fields at random where the recovery phrase can be verified.
 *
 * @signature `<phrase-input />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-input/phrase-input.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-input/phrase-input.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './phrase-input.less'
import view from './phrase-input.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the phrase-input component'
  }
})

export default Component.extend({
  tag: 'phrase-input',
  ViewModel,
  view
})
