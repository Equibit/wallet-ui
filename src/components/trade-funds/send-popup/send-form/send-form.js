/**
 * @module {can.Component} wallet-ui/components/trade-funds/send-popup/send-form send-popup > send-form
 * @parent components.portfolio 1
 *
 * The 1st form for the Send Popup component
 *
 * @signature `<send-form />`
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import accounting from 'accounting'
import './send-form.less'
import view from './send-form.stache'
import { convertToUserFiat, satoshi, unit } from '~/utils/currency-converter'
import Session from '~/models/session'
import { toMaxPrecision } from '../../../../utils/formatter'

export const ViewModel = DefineMap.extend({
  formData: {
    type: '*'
  },

  issuances: {
    type: '*'
  },

  portfolio: {
    type: '*'
  },

  sharesToUsd: {
    // TODO: the rate depends on the selected issuance!
    get (val, resolve) {
      convertToUserFiat(1, 'BTC', satoshi).then(avg => {
        resolve({
          rate: this.issuance.currentPricePerShare * avg,
          symbol: Session.fiatCurrency
        })
      })
    }
  },

  fundsToUsd: {
    get (val, resolve) {
      convertToUserFiat(1, this.formData.fundsType, unit).then(avg => {
        resolve({
          rate: avg,
          symbol: Session.fiatCurrency
        })
      })
    }
  },

  get availableFunds () {
    if (this.formData.type === 'FUNDS') {
      const balance = this.portfolio.balance
      const funds = this.formData.fundsType === 'BTC' ? balance.cashBtc : balance.cashEqb
      const availableFunds = toMaxPrecision(funds - this.formData.transactionFee, 8)
      return availableFunds < 0 ? 0 : availableFunds
    }
    if (this.formData.type === 'SECURITIES' && this.formData.issuance) {
      return this.formData.issuance.availableAmount
    }
  },

  // ENUM ('SECURITIES', 'FUNDS')
  setType (val, el) {
    this.formData.type = val
    el.blur()
  },

  setFundsType (val, el) {
    this.formData.fundsType = val
    el.blur()
  },

  formatIssuance (issuance) {
    // ${issuance.marketCap} uBTC
    return `<span class="issuance issuance-company">${issuance.companyName}</span> <span class="issuance issuance-name">${issuance.issuanceName}</span> <span class="issuance issuance-quantity">available ${formatShares(issuance.availableAmount)}</span>`
  },

  formatIssuanceInput (issuance) {
    // ${issuance.marketCap} uBTC
    return `${issuance.companyName} | ${issuance.issuanceName} | available ${formatShares(issuance.availableAmount)} Shares`
  },

  sendAllFunds () {
    if (this.formData.type === 'SECURITIES') {
      this.formData.securities = this.availableFunds
    } else {
      this.formData.amountCoin = this.availableFunds / 100000000
    }
  },

  openReceiveForm () {
    this.dispatch('receiveform')
  }
})

function formatShares (value) {
  return accounting.formatMoney(value, '', 0)
}

export default Component.extend({
  tag: 'send-form',
  ViewModel,
  view
})
