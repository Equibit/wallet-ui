/**
 * @module {can.Component} components/trade-funds/send-popup send-popup
 * @parent components.portfolio 0
 *
 * A short description of the send-popup component
 *
 * @signature `<send-popup />`
 *
 * @link ../src/components/trade-funds/send-popup/send-popup.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/send-popup/send-popup.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './send-popup.less'
import view from './send-popup.stache'
import Issuance from '~/models/issuance'
import Session from '~/models/session'
import { toMaxPrecision } from '~/utils/formatter'
import validators from '~/utils/validators'
import { translate } from '~/i18n/i18n'

const FormData = DefineMap.extend({
  /**
   * @property {String} type
   * ENUM ('SECURITIES', 'FUNDS')
   */
  type: '',

  portfolio: {
    type: '*'
  },

  /**
   * @property {String} fundsType
   * ENUM ('EQB', 'BTC')
   */
  fundsType: {
    type: 'string',
    value: 'EQB',
    get (val) {
      if (this.type === 'SECURITIES') {
        return 'EQB'
      }
      return val
    }
  },

  toAddress: {
    type: 'string',
    set (val) {
      this.toAddressError = validators.bitcoinAddress(val)
      return val
    }
  },
  toAddressError: 'string',

  amount: {
    type: 'number',
    set (val) {
      return toMaxPrecision(val, 8)
    }
  },

  hasEnoughFunds: {
    get () {
      return this.portfolio.hasEnoughFunds(this.amount, this.fundsType)
    }
  },

  price: 'number',
  issuance: Issuance,
  transactionFee: {
    type: 'number',
    value: 0.00001
  },
  get transactionFeePrice () {
    return this.type === 'FUNDS'
      ? (this.fundsType === 'BTC' ? this.btcToUsd(this.transactionFee) : this.eqbToUsd(this.transactionFee))
      : this.eqbToUsd(this.transactionFee)
  },
  description: 'string',

  btcToUsd (BTC) {
    return BTC * Session.current.rates.btcToUsd
  },

  eqbToUsd (EQB) {
    return EQB * Session.current.rates.eqbToUsd
  },

  isValid: {
    get () {
      return !this.toAddressError && this.hasEnoughFunds
    }
  },

  validate () {
    if (!this.toAddress && !this.toAddressError) {
      this.toAddressError = translate('missingAddress')
    }
  }
})

export const ViewModel = DefineMap.extend({
  portfolio: {
    type: '*'
  },

  formData: {
    get (val) {
      if (val) {
        return val
      }
      return new FormData({
        portfolio: this.portfolio
      })
    }
  },
  mode: {
    value: 'edit'
  },
  issuances: {
    get (val, resolve) {
      if (!val) {
        Issuance.getList().then(resolve)
      }
      return val
    }
  },
  next () {
    this.formData.validate()
    if (!this.formData.isValid) {
      return
    }
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  send (close) {
    this.dispatch('send', [this.formData])
    close()
  }
})

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
})
