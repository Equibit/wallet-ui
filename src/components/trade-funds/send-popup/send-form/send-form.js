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
import DefineMap from 'can-define/map/'
import './send-form.less'
import view from './send-form.stache'
import { Currency } from '~/components/trade-funds/currency-converter/'
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
    value: {
      rate: 110,
      symbol: 'USD'
    }
  },

  get fundsToUsd () {
    const val = this.formData.fundsType === 'EQB'
      ? { rate: Session.current.rates.eqbToUsd, symbol: 'USD' }
      : { rate: Session.current.rates.btcToUsd, symbol: 'USD' }
    return new Currency(val)
  },

  get availableFunds () {
    const balance = this.portfolio.balance
    const funds = this.formData.fundsType === 'BTC' ? balance.cashBtc : balance.cashEqb
    const availableFunds = toMaxPrecision(funds - this.formData.transactionFee, 8)
    return availableFunds < 0 ? 0 : availableFunds
  },

  setType (val, el) {
    this.formData.type = val
    el.blur()
  },

  setFundsType (val, el) {
    this.formData.fundsType = val
    el.blur()
  },

  formatIssuance (issuance) {
    return `<span class="issuance issuance-company">${issuance.companyName}</span> <span class="issuance issuance-name">${issuance.issuanceName}</span> <span class="issuance issuance-quantity">${issuance.marketCap} uBTC</span>`
  },

  formatIssuanceInput (issuance) {
    return `${issuance.companyName} | ${issuance.issuanceName} | ${issuance.marketCap} uBTC`
  },

  sendAllFunds () {
    this.formData.amount = this.availableFunds
  },

  openReceiveForm () {
    this.dispatch('receiveform')
  }
})

export default Component.extend({
  tag: 'send-form',
  ViewModel,
  view
})
