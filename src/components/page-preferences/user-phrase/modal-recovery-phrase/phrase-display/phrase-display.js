/**
 * @module {can.Component} wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display phrase-display
 * @parent components.user-preferences
 *
 * Shows the recovery phrase.
 *
 * @signature `<phrase-display />`
 *
 * @link ../src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display/phrase-display.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-preferences/user-phrase/modal-recovery-phrase/phrase-display/phrase-display.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './phrase-display.less'
import view from './phrase-display.stache'

export const ViewModel = DefineMap.extend({
  words: {
    type: '*'
  },
  step: 'number',
  wordIndex (index) {
    return (this.step - 1) * 4 + index + 1
  }
})

export default Component.extend({
  tag: 'phrase-display',
  ViewModel,
  view
})
