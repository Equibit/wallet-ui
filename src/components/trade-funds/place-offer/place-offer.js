/**
 * @module {can.Component} components/trade-funds/place-offer place-offer
 * @parent components.buy-sell-offers 0
 *
 * This component shows the modal with the forms for placing a buy or sell offers.
 *
 * @signature `<place-offer />`
 *
 * @link ../src/components/trade-funds/place-offer/place-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/trade-funds/place-offer/place-offer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './place-offer.less'
import view from './place-offer.stache'
import Session from '../../../models/session'
import Portfolio from '../../../models/portfolio'
import Order from '../../../models/order'
import Transaction from '../../../models/transaction/transaction'
import Issuance from '../../../models/issuance'
import FormData from './form-data'

export const ViewModel = DefineMap.extend({
  portfolio: {
    Type: Portfolio,
    // todo: use stream api in changeAddrPromise for a declarative style.
    set (val) {
      this.changeAddrPromise = val && val.getNextAddress && val.getNextAddress(true)
      return val
    }
  },
  order: Order,
  issuance: Issuance,
  transactionFeeRatesPromise: {
    get () {
      return Session.current.transactionFeeRatesPromise
    }
  },
  transactionFeeRates: {
    get (val, resolve) {
      this.transactionFeeRatesPromise.then(resolve)
    }
  },
  // Is set by portfolio setter:
  changeAddrPromise: '*',
  mode: {
    value: 'edit'
  },
  formData: {
    value (val) {
      if (!this.portfolio) {
        console.error('Requires a portfolio')
        return
      }
      if (!this.order) {
        console.error('Requires an order')
        return
      }
      return new FormData({
        portfolio: this.portfolio,
        order: this.order,
        issuance: this.issuance,
        feeRates: this.transactionFeeRates,
        fee: (this.transaction && this.transaction.fee) || Transaction.defaultFee,
        timelock: this.offer.timelock
      })
    }
  },
  transaction: '*',

  get sendOfferTitle () {
    return this.order.type === 'SELL'
      ? 'sendOfferPayment'
      : (this.order.assetType === 'EQUIBIT' ? 'sendOfferEquibits' : 'sendOfferSecurities')
  },

  next () {
    if (!this.formData.isValid || !this.portfolio) {
      return
    }
    this.offer.quantity = this.formData.quantity
    Promise.all([
      this.transactionFeeRatesPromise,
      this.changeAddrPromise
    ]).then(([transactionFeeRates, changeAddrPair]) => {
      const flowType = this.formData.flowType
      // Bid flow: change address for Blank EQB.
      const changeAddr = flowType === 'Ask' ? changeAddrPair.BTC : changeAddrPair.EQB
      const tx = Transaction.createHtlc1(
        this.offer, this.order, this.portfolio, this.issuance, changeAddr,
        transactionFeeRates.regular
      )
      this.transaction = tx
      this.formData.fee = this.transaction.fee
    }).then(() => {
      if (this.formData.isValid) {
        this.mode = 'confirm'
      }
    }).catch(e => {
      console.log('error:::', e)
      if (e.data && e.data.fee) {
        this.formData.fee = e.data.fee
      }
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
    this.offer.timelock = this.formData.timelock
    this.offer.description = this.formData.description
    this.transaction.rebuild({timelock: this.offer.timelock})

    this.sendFn(this.offer, this.transaction)
      .then(() => {
        this.isSending = false

        // Mark change address as used:
        this.changeAddrPromise.then(addr => {
          const currencyType = this.order.type === 'SELL' ? 'BTC' : 'EQB'
          this.portfolio.markAsUsed(addr[currencyType], currencyType, true)
        })
        close()
      })
      .catch(err => {
        this.isSending = false
        close()
        throw err
      })
  }
})

export default Component.extend({
  tag: 'place-offer',
  ViewModel,
  view
})
