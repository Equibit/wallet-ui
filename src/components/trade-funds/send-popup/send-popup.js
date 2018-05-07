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
import DefineMap from 'can-define/map/map'
import './send-popup.less'
import view from './send-popup.stache'
import Session from '../../../models/session'
import Issuance from '../../../models/issuance'
import Transaction from '../../../models/transaction/transaction'
import FormData from './form-data'
import { createTransfer } from '../../../models/transaction/transaction-transfer'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  // Authorized issuances:
  issuances: {
    Type: Issuance.List
  },
  // Investor issuances:
  securities: {
    get () {
      return this.portfolio && this.portfolio.securities
    }
  },
  tx: '*',
  changeAddr: '*',
  formData: {
    get (val) {
      if (val) {
        return val
      }
      return new FormData({
        portfolio: this.portfolio,
        issuanceOnly: this.issuanceOnly,
        rates: Session.current.rates
      })
    }
  },
  mode: {
    value: 'edit'
  },
  issuanceOnly: 'boolean',
  toAddress: '*',
  next () {
    this.formData.validate()
    if (!this.formData.isValid) {
      return
    }
    const currencyType = this.formData.fundsType
    return Promise.all([
      this.portfolio.nextChangeAddress(),
      Session.current.transactionFeeRatesPromise
    ]).then(([addrObj, transactionFeeRates]) => {
      const changeAddr = addrObj[currencyType]
      // const transactionFeeRate = transactionFeeRates.regular[currencyType]
      // let tx = this.prepareTransaction(this.formData, changeAddr, 3000)

      // Calculate fee and rebuild:
      // const transactionFee = tx.hex.length / 2 * transactionFeeRate
      const tx = this.prepareTransaction(this.formData, changeAddr, transactionFeeRates.regular)
      this.tx = tx

      this.changeAddr = changeAddr
      this.formData.transactionFee = tx.fee
      console.log(`tx.fee=${tx.fee}, tx.hex=${tx.hex}`, tx)
      this.mode = 'confirm'
    })
  },
  edit () {
    this.mode = 'edit'
  },
  sendFn: '*',
  isSending: {
    value: false
  },
  send (close) {
    this.isSending = true
    this.sendFn(this.tx, this.changeAddr)
      .then(() => {
        this.isSending = false
        close()
      })
      .catch(err => {
        this.isSending = false
        close()
        throw err
      })
  },

  openReceiveForm (close) {
    this.dispatch('receiveform')
    close()
  },

  prepareTransaction (formData, changeAddr, transactionFeeRates) {
    const amount = formData.quantity
    const toAddress = formData.toAddress
    const type = formData.type === 'FUNDS' ? formData.fundsType : 'ISSUANCE'

    const txData = createTransfer(
      type, amount, toAddress, changeAddr,
      this.portfolio, formData.issuance, transactionFeeRates, formData.description
    )
    return new Transaction(txData)
  }
})

export default Component.extend({
  tag: 'send-popup',
  ViewModel,
  view
})
