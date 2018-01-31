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
import DefineMap from 'can-define/map/map'
import { merge } from 'ramda'
import './create-issuance.less'
import view from './create-issuance.stache'
import FormData from './form-data'
import Transaction from '../../../models/transaction/transaction'
import Session from '../../../models/session'
import { translate } from '../../../i18n/'
import hub, { dispatchAlertError }  from '../../../utils/event-hub'
import utils from '../../../models/portfolio-utils'
const { importAddr } = utils

export const ViewModel = DefineMap.extend({
  mode: {
    type: 'string',
    value: 'edit'
  },
  portfolio: '*',
  issuances: '*',
  formData: {
    get () {
      if (this.portfolio && this.issuances) {
        return new FormData({
          portfolio: this.portfolio,
          issuances: this.issuances
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
  /**
   * To create an new issuance we need:
   * - generate a new address with the key path ".../<companyIndex> /<issuanceIndex> "
   * - generate a new change address
   * - create issuance authorization transaction
   * - save new issuance in DB
   * - mark both new addresses as used in portfolio-addresses
   */
  createIssuance (formData) {
    if (!formData) {
      console.error('Error: received no form data')
      return Promise.reject(new Error('No form data provided'))
    }
    // build transaction
    // save transaction
    // save issuance
    const issuance = formData.issuance
    const company = issuance.selectedCompany

    // Define issuance index:
    issuance.index = formData.issuances.getNewIndex(company._id)

    const currencyType = 'EQB'
    // todo: simplify, hide this in models.
    const companyHdNode = Session.current.user.generatePortfolioKeys(company.index).EQB

    // New issuance address:
    const issuanceHdNode = companyHdNode.derive(issuance.index)
    const toAddress = issuanceHdNode.getAddress()
    // Save public issuance address:
    issuance.issuanceAddress = toAddress
    issuance.keys = issuanceHdNode

    console.log(`createIssuance: toAddress=${toAddress}`, formData, issuance)

    return importAddr(toAddress, 'EQB').then(() => this.portfolio.nextChangeAddress())
    .then(addrObj => addrObj[currencyType])
    .then((changeAddr) => {
      console.log(`toAddress=${toAddress}, changeAddr=${changeAddr}`)
      const tx = this.prepareTransaction(formData, issuance, toAddress, changeAddr)

      // Save authorization transaction id:
      issuance.issuanceTxId = tx.txId

      // Show the spinner:
      // this.isSending = true

      return tx.save().then(() => [toAddress, changeAddr])
    }).then(([toAddress, changeAddr]) => {
      console.log('[createIssuance] transaction was saved')
      // this.isSending = false

      // mark change address as used
      console.log(`[my-portfolio.send] marking change address as used ${changeAddr}...`)
      this.portfolio.markAsUsed(changeAddr, currencyType, true)
      return issuance.save()
    }).then(issuance => {
      const msg = translate('issuanceAuthorized') + ': ' + issuance.issuanceName
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': msg,
        'displayInterval': 10000
      })
      Session.current.refreshBalance()
      return issuance
    }).catch(dispatchAlertError)
  },
  prepareTransaction (formData, issuance, toAddress, changeAddr) {
    const amount = formData.amount
    const currencyType = 'EQB'
    const issuanceJson = issuance.getJson()
    const utxo = this.portfolio.getEmptyEqb(amount + formData.transactionFee)
    if (utxo.sum < amount + formData.transactionFee) {
      throw new Error('Not enough UTXO')
    }
    const txouts = utxo.txouts
      // .filter(a => !a.issuanceId)
      .map(a => merge(a, {keyPair: this.portfolio.findAddress(a.address).keyPair}))
    const options = {
      fee: formData.transactionFee,
      changeAddr,
      type: 'AUTH', // for Authorization
      currencyType,
      issuanceJson,
      issuance,
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
