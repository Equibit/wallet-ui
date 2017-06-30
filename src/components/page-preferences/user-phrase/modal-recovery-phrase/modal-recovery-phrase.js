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
import DefineList from 'can-define/list/'
import './modal-recovery-phrase.less'
import view from './modal-recovery-phrase.stache'

export const ViewModel = DefineMap.extend({
  mode: {
    value: 'intro'
  },
  phrase: {
    Type: DefineList,
    value: new DefineList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  },
  currentWords: {
    get () {
      const start = 4 * (this.step - 1)
      return this.phrase.slice(start, start + 4)
    }
  },
  step: {
    type: 'number',
    value: 1,
    set (val) {
      if (val > 3) {
        return 3
      }
      if (val < 1) {
        return 1
      }
      return val
    }
  },
  view () {
    this.mode = 'view'
  },
  continue () {
    if (this.step === 3) {
      this.mode = 'edit'
    } else {
      this.step++
    }
  },
  back () {
    if (this.step === 1) {
      this.mode = 'intro'
    } else {
      this.step--
    }
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
