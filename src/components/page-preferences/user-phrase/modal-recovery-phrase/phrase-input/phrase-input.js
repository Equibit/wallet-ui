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
import Kefir from 'kefir'
import randomElements from '../../../../../utils/random-elements'
import canDefineStream from 'can-define-stream-kefir'

export const ViewModel = DefineMap.extend({
  phrase: {
    type: '*'
  },
  checkWords: {
    stream () {
      return this.toStream('.phrase').map(() => {
        return randomElements(this.phrase, 4)
      })
    }
  },
  enteredWords: {
    type: '*',
    value () {
      return new DefineList([])
    }
  },
  isCorrect: {
    get () {
      return this.enteredWords &&
        this.enteredWords.length === 4 &&
        this.errorFields &&
        this.errorFields.filter(x => x).length < 1
    }
  },
  lastErrorFields: {},
  errorFields: {
    stream () {
      return Kefir.combine([
        this.toStream('.checkWords'),
        this.toStream('validate'),
        Kefir.constant({}).concat(this.toStream('.enteredWords add'))
      ],
        (checkWords) => {
          const enteredWords = this.enteredWords
          return checkWords.values.map((word, index) => {
            if (!enteredWords.get(index)) {
              return 'recoveryPhraseWordMissing'
            }
            if (word !== enteredWords.get(index)) {
              return 'recoveryPhraseWordIncorrect'
            }
          })
        }
      )
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
