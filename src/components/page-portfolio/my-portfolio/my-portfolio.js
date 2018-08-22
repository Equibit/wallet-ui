/**
 * @module {can.Component} wallet-ui/components/page-portfolio/my-portfolio my-portfolio
 * @parent components.portfolio
 *
 * A short description of the my-portfolio component
 *
 * @signature `<my-portfolio />`
 *
 * @link ../src/components/page-portfolio/my-portfolio/my-portfolio.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-portfolio/my-portfolio/my-portfolio.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './my-portfolio.less'
import view from './my-portfolio.stache'
import hub from '../../../utils/event-hub'
import { translate } from '~/i18n/'
import Portfolio from '../../../models/portfolio'
import Issuance from '../../../models/issuance'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import { merge } from 'ramda'

let portfolio

export const ViewModel = DefineMap.extend({
  portfolio: Portfolio,
  issuances: Issuance.List,
  isSending: 'boolean',
  isSendFundsPopup: 'boolean',
  isReceiveFundsPopup: 'boolean',
  isRecoveryPhrasePopup: 'boolean',
  isAuthModalPopup: 'boolean',
  secondFactorCode: 'string',
  user: {
    value () {
      return Session.current.user
    }
  },
  receiveFunds () {
    this.isReceiveFundsPopup = false
    if (!this.portfolio) {
      portfolio = new Portfolio({name: 'My Portfolio'})
      portfolio.save().then(portfolio => {
        portfolio.keys = Session.current.user.generatePortfolioKeys(portfolio.index)
        this.portfolio = portfolio
        // Session.current.portfolios.push(portfolio)
        this.showFirstModal()
      })
    } else {
      this.showFirstModal()
    }
  },
  showFirstModal () {
    this.isReceiveFundsPopup = false
    this.isAuthModalPopup = false
    this.isRecoveryPhrasePopup = false

    if (this.user.hasRecordedMnemonic) {
      this.isReceiveFundsPopup = true
    } else if (this.user.twoFactorValidatedSession) {
      this.isRecoveryPhrasePopup = true
    } else {
      this.isAuthModalPopup = true
    }
  },
  codeVerified (args) {
    const code = args[1]
    this.secondFactorCode = code
    this.isRecoveryPhrasePopup = true
  },
  recoveryPhraseDone () {
    this.isRecoveryPhrasePopup = false
    this.isReceiveFundsPopup = true
  },
  receiveDone () {
    if (!this.portfolio) {
      this.portfolio = portfolio
    }
    this.isReceiveFundsPopup = false
  },

  // removed ability to send issuances from this page
  // in commit fa099252e5f305eacc90382946869088112d3fc9

  send (tx, changeAddr) {
    const currencyType = tx.currencyType
    console.log('tx.hex: ' + tx.hex, tx)

    // Show the spinner:
    this.isSending = true

    return tx.save().then(() => {
      console.log('[my-portfolio.send] transaction was saved')
      Session.current.refreshBalance()
      // mark change address as used
      // this.portfolio.nextChangeAddress[currencyType]
      console.log('[my-portfolio.send] marking change address as used ...')
      this.portfolio.markAsUsed(changeAddr, currencyType, true)
    }).then(
      result => {
        this.isSending = false
        return result
      },
      err => {
        this.isSending = false
        throw err
      }
    )
  },

  nextAddress: {
    get (val, resolve) {
      if (val) {
        return val
      }
      this.portfolio.nextAddress().then(resolve)
    }
  },

  addrsLoaded: {
    get (val, resolve) {
      if (!this.portfolio.listunspentPromise) {
        return false
      }
      this.portfolio.listunspentPromise.then(() => {
        if (this.portfolio.addresses.isPending) {
          return false
        }
        setTimeout(() => resolve(true), 500)
      })
    }
  },

  // To cancel an issuance we strip out issuance_tx_id and send as Blank EQB to a new EQB address.
  cancelIssuance (issuance) {
    return issuance.cancel().then(() => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': translate('issuanceWasCancelled'),
        'displayInterval': 12000
      })
      Session.current.refreshBalance()
    })
  }
})

const sendIssuance = (portfolio, formData) => {
  if (!formData.issuance) {
    console.error('Error: issuance is not defined. formData: ', formData)
    return
  }
  if (!formData.issuance.keys) {
    console.error('Error: issuance.keys is not defined. issuance: ', formData.issuance)
    return
  }
  const issuance = formData.issuance

  const toAddress = formData.toAddress
  const changeAddr = issuance.address
  const currencyType = 'EQB'
  const amount = formData.quantity

  const txouts = issuance.getTxoutsFor(amount).txouts
    .map(a => merge(a, {keyPair: issuance.keys.keyPair}))

  const txoutsFeeInfo = portfolio.getTxouts(formData.transactionFee, 'EQB')
  const txoutsFee = txoutsFeeInfo.txouts
    .map(a => merge(a, {keyPair: portfolio.findAddress(a.address).keyPair}))
  txouts.push.apply(txouts, txoutsFee)

  const amountEqb = txoutsFee.reduce((acc, { amount }) => (acc + amount), 0)

  // if we dont send all authorized shares then change goes back to the same issuance address
  let json = txouts[0].equibit.issuance_json || txouts[0].equibit.payload
  const issuanceJson = JSON.parse(json)

  // todo: for now just send the blank EQB change back to where we got it:
  const changeAddrBlankEqb = txoutsFee[0].address

  const options = {
    fee: formData.transactionFee,
    changeAddr,
    changeAddrBlankEqb,
    amountEqb,
    type: 'TRANSFER',
    currencyType,
    description: formData.description,
    // TODO: issuanceTxId should not just be from the UTXO. This should be a txid of the authorization transaction!
    issuanceTxId: issuance.utxo[0].txid,
    issuanceJson,
    issuance
  }
  const tx = Transaction.makeTransaction(amount, toAddress, txouts, options)

  return tx.save().then(() => {
    portfolio.markAsUsed(changeAddrBlankEqb, 'EQB', true)
  })
}

export default Component.extend({
  tag: 'my-portfolio',
  ViewModel,
  view
})

export { sendIssuance }
