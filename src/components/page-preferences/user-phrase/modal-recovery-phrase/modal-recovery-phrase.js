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
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/'
import './modal-recovery-phrase.less'
import view from './modal-recovery-phrase.stache'
import Session from '~/models/session'
import User from '~/models/user/'
import { translate } from '~/i18n/'

export const ViewModel = DefineMap.extend({
  errorMessage: 'string',
  user: {
    value: function () {
      return Session.current.user
    }
  },
  mode: {
    value: 'intro'
  },
  phrase: {
    Type: DefineList,
    value: function () {
      return Session.current.user.decrypt(Session.current.user.encryptedMnemonic).split(' ')
    }
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
  isCorrect: 'boolean',
  inputVm: {},
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
    this.errorMessage = ''
    this.inputVm.dispatch('validate', {}) // need a data argument here for streams to pick up the event
    if (this.isCorrect) {
      User.connection.updateData({
        _id: this.user._id,
        hasRecordedMnemonic: true
      }).then(() => {
        this.mode = 'end'
      }, error => {
        this.errorMessage = error.message
      })
    } else {
      this.errorMessage = translate('recoveryPhraseSetupIncorrectEntry')
    }
  },
  risk () {
    this.mode = 'risk'
  },
  intro () {
    this.mode = 'intro'
  },
  doClose (close) {
    this.dispatch('close')
    close()
  }
})

export default Component.extend({
  tag: 'modal-recovery-phrase',
  ViewModel,
  view
})
