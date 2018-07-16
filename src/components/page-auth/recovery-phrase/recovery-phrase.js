/**
 * @module {can.Component} components/page-auth/recovery-phrase/recovery-phrase recovery-phrase
 * @parent components.auth
 *
 * Prompts the user to enter the backup recovery phrase after loging in.
 *
 * @signature `<recovery-phrase />`
 *
 * @link ../src/components/page-auth/recovery-phrase/recovery-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-auth/recovery-phrase/recovery-phrase.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import view from './recovery-phrase.stache'
import route from 'can-route'
import hub from '~/utils/event-hub'
import { translate } from '../../../i18n/i18n'
import Session from '~/models/session'

export const ViewModel = DefineMap.extend({
  user: {
    type: '*'
  },
  mnemonic: 'string',
  error: 'string',
  pending: 'boolean',
  mode: {
    value: 'prompt',
    set (val) {
      if (['prompt', 'warning', 'confirm', 'try-again'].indexOf(val) === -1) {
        console.error('Error: wrong value for the mode: ' + val)
        val = 'prompt'
      }
      return val
    }
  },
  switch (val) {
    this.mode = val
  },
  verifyMnemonic (ev) {
    if (ev) {
      ev.preventDefault()
    }
    if (!this.user.mnemonicHash) {
      this.error = translate('validationMnemonicNoDbValue')
      return
    }
    const isValid = this.user.hashEmailAndMnemonic(this.mnemonic) === this.user.mnemonicHash
    if (!isValid) {
      this.error = translate('validationMnemonicWrong')
      return
    }
    this.user.generateKeysAndPatchUser(this.mnemonic)
    route.data.page = 'portfolio'
    hub.dispatch({
      'type': 'alert',
      'kind': 'success',
      'title': translate('fundsRecoveredMsg'),
      'displayInterval': 10000
    })
  },
  recoverFunds (ev) {
    if (ev) {
      ev.preventDefault()
    }
    if (!this.mnemonic) {
      this.error = translate('validationMnemonicEmpty')
      return
    }
    this.pending = true
    this.user.generateKeysAndPatchUser(this.mnemonic)
      .then(() => {
        const noop = () => {}
        this.user.isRecovered = true
        return Session.current.portfoliosPromise.then(portfolios => {
          if (portfolios[0]) {
            portfolios[0].keys = Session.current.user.generatePortfolioKeys(0)
            return portfolios[0].addressesMetaPromise.then(() => {
              portfolios[0].on('listunspentPromise', noop)
              portfolios[0].refreshBalance()
              return portfolios[0].listunspentPromise
            })
          } else {
            return Promise.resolve({
              BTC: { summary: { total: 0 } },
              EQB: { summary: { total: 0 } }
            })
          }
        }).then(balance => {
          const total = Object.keys(balance).reduce((total, key) => {
            total += balance[key].summary.total
            return total
          }, 0)
          Session.current.portfoliosPromise.then(portfolios => {
            portfolios[0] && portfolios[0].off('listunspentPromise', noop)
          })
          if (total > 0) {
            route.data.page = 'portfolio'
            hub.dispatch({
              'type': 'alert',
              'kind': 'success',
              'title': translate('fundsRecoveredMsg'),
              'displayInterval': 10000
            })
          } else {
            this.mode = 'confirm'
          }
        })
      })
      .then(() => { this.pending = false }, () => { this.pending = false })
  },
  confirmNoPhrase () {
    this.user.generateKeysAndPatchUser()
      .then(() => {
        route.data.page = 'portfolio'
      })
  },
  get disableButton () {
    return this.error || this.pending
  }
})

export default Component.extend({
  tag: 'recovery-phrase',
  ViewModel,
  view
})
