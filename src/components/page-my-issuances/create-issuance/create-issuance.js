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
import hub, { dispatchAlertError } from '../../../utils/event-hub'
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
  issuance: '*',
  tx: '*',

  // Methods:
  next () {
    this.formData.submissionAttempted = true
    if (
      this.formData.companyMissing ||
      this.formData.issuanceNameMissing ||
      this.formData.issuanceTypeMissing ||
      this.formData.restrictionLevelMissing
    ) {
      return
    }
    return this.createIssuance().then(() => {
      this.mode = 'confirm'
    })
  },
  edit () {
    this.mode = 'edit'
  },
  companyIsSaving: {
    value: false
  },
  saveCompany () {
    this.companyIsSaving = true
    this.newCompany.validateAndSave().then(() => {
      this.companyIsSaving = false
      this.mode = 'edit'
      this.formData.companies.push(this.newCompany)
      this.formData.issuance.selectedCompany = this.newCompany
    }).catch(err => {
      this.companyIsSaving = false
      throw err
    })
  },
  issuanceIsSaving: {
    value: false
  },
  create (close) {
    this.issuanceIsSaving = true
    this.saveIssuance(this.formData).then(issuance => {
      this.dispatch('created', [issuance])
      this.issuanceIsSaving = false
      close()
    }).catch(err => {
      this.issuanceIsSaving = false
      throw err
    })
  },
  /**
   * To create an new issuance we need:
   * - generate a new address with the key path ".../<companyIndex> /<issuanceIndex> "
   * - generate a new change address
   * - create issuance authorization transaction
   * - save new issuance in DB
   * - mark new address (change) as used in portfolio-addresses
   */
  createIssuance () {
    const formData = this.formData
    if (!formData) {
      console.error('Error: received no form data')
      return Promise.reject(new Error('No form data provided'))
    }
    const issuance = formData.issuance
    const company = issuance.selectedCompany

    // Define issuance index:
    issuance.index = formData.issuances.getNewIndex(company._id)

    // todo: simplify, hide this in models.
    const companyHdNode = Session.current.user.generatePortfolioKeys(company.index).EQB

    // New issuance address:
    const issuanceHdNode = companyHdNode.derive(issuance.index)
    const toAddress = issuanceHdNode.getAddress()
    // Save public issuance address:
    issuance.issuanceAddress = toAddress
    issuance.keys = issuanceHdNode

    console.log(`createIssuance: toAddress=${toAddress}`, formData, issuance)

    return Promise.all([
      this.portfolio.nextChangeAddress(),
      Session.current.transactionFeeRatesPromise,
      importAddr(toAddress, 'EQB')
    ]).then(([addrPair, transactionFeeRates]) => {
      const changeAddr = addrPair.EQB
      console.log(`toAddress=${toAddress}, changeAddr=${changeAddr}`)
      const defaultFee = (this.tx && this.tx.fee) || 1000
      let tx = this.prepareTransaction(formData, issuance, toAddress, changeAddr, defaultFee)
      // Rebuild with the estimated fee:
      const realFee = tx.hex.length / 2 * transactionFeeRates.regular.EQB
      console.log(`transaction fee: ${realFee}`)
      tx = this.prepareTransaction(formData, issuance, toAddress, changeAddr, realFee)
      this.tx = tx
      formData.transactionFee = realFee

      // Save authorization transaction id:
      issuance.issuanceTxId = tx.txId
      this.issuance = issuance

      // Save change address for markAsUsed later:
      formData.changeAddr = changeAddr
    })
  },
  saveIssuance (formData) {
    return this.tx.save().then(() => {
      const changeAddr = formData.changeAddr
      console.log('[createIssuance] transaction was saved')

      // mark change address as used
      console.log(`[my-portfolio.send] marking change address as used ${changeAddr}...`)
      this.portfolio.markAsUsed(changeAddr, 'EQB', true)
      return this.issuance.save()
    }).then(issuance => {
      const msg = translate('issuanceAuthorized') + ': ' + issuance.issuanceName
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': msg,
        'displayInterval': 10000
      })
      Session.current.refreshBalance()
    }).catch(dispatchAlertError)
  },
  prepareTransaction (formData, issuance, toAddress, changeAddr, fee) {
    const amount = formData.amount
    const currencyType = 'EQB'
    const issuanceJson = issuance.getJson()
    const utxo = this.portfolio.getBlankEqb(amount + fee)
    if (utxo.sum < amount + fee) {
      throw new Error('Not enough UTXO')
    }
    const txouts = utxo.txouts
      // .filter(a => !a.issuanceId)
      .map(a => merge(a, { keyPair: this.portfolio.findAddress(a.address).keyPair }))
    const options = {
      fee: fee,
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
