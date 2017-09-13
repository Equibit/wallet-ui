/**
 * @module {can.Component} wallet-ui/components/page-my-issuances/create-issuance create-issuance
 * @parent components.common
 *
 * A short description of the create-issuance component
 *
 * @signature `<create-issuance />`
 *
 * @link ../src/components/page-my-issuances/create-issuance/create-issuance.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-my-issuances/create-issuance/create-issuance.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import { merge } from 'ramda'
import './create-issuance.less'
import view from './create-issuance.stache'
import FormData from './form-data'
import Transaction from '../../../models/transaction'

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'edit'
  },
  portfolio: '*',
  formData: {
    get () {
      if (this.portfolio) {
        return new FormData({
          portfolio: this.portfolio
        })
      }
    }
  },
  newCompany: '*',

  // Methods:
  next () {
    this.mode = 'confirm'
  },
  edit () {
    this.mode = 'edit'
  },
  saveCompany () {
    this.newCompany.validateAndSave().then(() => {
      this.mode = 'edit'
      this.formData.companies.push(this.newCompany)
      this.formData.issuance.selectedCompany = this.newCompany
    })
  },
  create (close) {
    this.createIssuance(this.formData).then(issuance => {
      this.dispatch('created', [issuance])
      close()
    })
  },
  createIssuance (formData) {
    // build transaction
    // save transaction
    // save issuance
    const issuance = formData.issuance
    const currencyType = 'EQB'

    console.log('createIssuance: ', formData, issuance)
    if (!formData) {
      console.error('Error: received no form data')
      return Promise.reject()
    }

    return Promise.all([
      this.portfolio.getNextAddress(),
      this.portfolio.nextChangeAddress()
    ]).then(addresses => {
      return addresses.map(addrObj => addrObj[currencyType])
    }).then(([toAddress, changeAddr]) => {
      console.log(`toAddress=${toAddress}, changeAddr=${changeAddr}`)
      const tx = this.prepareTransaction(formData, issuance, toAddress, changeAddr)
      console.log('tx.hex: ' + tx.hex, tx)

      // Show the spinner:
      //this.isSending = true

      return tx.save().then(() => [toAddress, changeAddr])
    }).then(([toAddress, changeAddr]) => {
      console.log('[createIssuance] transaction was saved')
      //this.isSending = false

      // mark change address as used
      // this.portfolio.nextChangeAddress[currencyType]
      console.log('[my-portfolio.send] marking change address as used ...')
      this.portfolio.markAsUsed(changeAddr, currencyType, true)
      return issuance.save()
    }).then(issuance => {
      const msg = translate('issuanceAuthorized') + ': ' + issuance.issuanceName
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': msg,
        'displayInterval': 5000
      })
      Session.current.refreshBalance()
      return issuance
    })
  },
  prepareTransaction (formData, issuance, toAddress, changeAddr) {
    const amount = formData.amount
    const currencyType = 'EQB'
    const issuanceJson = issuance.getJson()
    const txouts = this.portfolio
      .getTxouts(amount + formData.transactionFee, currencyType)
      // .filter(a => !a.issuanceId)
      .map(a => merge(a, {keyPair: this.portfolio.findAddress(a.address).keyPair}))
    const options = {
      fee: formData.transactionFee,
      changeAddr,
      type: 'AUTH', // for Authorization
      currencyType,
      issuanceJson,
      description: 'Authorizing a new Issuance'
    }
    return Transaction.makeTransaction(amount, toAddress, txouts, options)
  }
})

export default Component.extend({
  tag: 'create-issuance',
  ViewModel,
  view
})
