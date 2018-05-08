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
import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/'
import './phrase-input.less'
import view from './phrase-input.stache'
import randomElements from '../../../../../utils/random-elements'
import canDefineStream from 'can-define-stream-kefir'

export const ViewModel = DefineMap.extend({
  phrase: {
    type: '*'
  },
  phraseArray: {
    get () {
      return this.phrase
    }
  },
  checkWords: {
    stream: function () {
      return this.toStream('.phrase').map(() => {
        return randomElements(this.phraseArray, 4)
      })
    }
  },
  enteredWords: {
    type: '*',
    value: new DefineList([])
  },
  isCorrect: {
    get () {
      return this.enteredWords &&
        this.enteredWords.length === 4 &&
        this.errorFields.filter(x => x).length < 1
    }
  },
  lastErrorFields: {},
  errorFields: {
    get () {
      return this.checkWords.values.map((word, index) => {
        return word === this.enteredWords.get(index) ? undefined : word
      })
    }
  }
})

canDefineStream(ViewModel)

export default Component.extend({
  tag: 'phrase-input',
  ViewModel,
  view,
  events: {
    inserted () {
      this.viewModel.enteredWords.replace([])
    }
  }
})
