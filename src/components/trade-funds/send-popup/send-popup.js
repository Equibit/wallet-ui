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
  type: {
    get (val) {
      if (this.issuanceOnly) {
        return 'SECURITIES'
      }
      return val
    }
  },

  issuanceOnly: 'boolean',

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
  shares: {
    set (val) {
      this.amount = val / 100000000
      return val
    }
  },

  hasFunds: {
    get () {
      return (this.portfolio.balance[this.fundsType === 'BTC' ? 'cashBtc' : 'cashEqb'] - this.transactionFee) > 0
    }
  },

  hasEnoughFunds: {
    get () {
      if (this.type === 'FUNDS') {
        return this.portfolio.hasEnoughFunds(this.amount + this.transactionFee, this.fundsType)
      }
      if (this.type === 'SECURITIES' && this.issuance) {
        // Need available shares amount and Empty EQB for the fee:
        return this.issuance.availableAmount >= this.amount && this.portfolio.hasEnoughFunds(this.transactionFee, 'EQB')
      }
    }
  },

  price: 'number',
  issuance: Issuance,
  transactionFee: {
    type: 'number',
    // todo: calculate fee
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

  sharesToEqb: {
    get () {
      return {
        rate: 1 / (100 * 1000 * 1000),
        symbol: 'EQB'
      }
    }
  },

  isValid: {
    get () {
      return !this.toAddressError && (this.hasEnoughFunds || this.type === 'SECURITIES') && this.amount > 0
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
        portfolio: this.portfolio,
        issuanceOnly: this.issuanceOnly
      })
    }
  },
  mode: {
    value: 'edit'
  },
  issuanceOnly: 'boolean',
  toAddress: '*',
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
  },

  openReceiveForm (close) {
    this.dispatch('receiveform')
    close()
  }
})

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
})
