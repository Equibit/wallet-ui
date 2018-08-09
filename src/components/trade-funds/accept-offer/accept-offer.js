/**
 * @module {can.Component} wallet-ui/components/trade-funds/accept-offer accept-offer
 * @parent components.common
 *
 * Input should include:
 *    - transaction (with address, amount and fee) and
 *    - issuance details.
 * Output would be:
 *    - timelock value and
 *    - description.
 *
 * @signature `<accept-offer />`
 *
 * @link ../src/wallet-ui/components/trade-funds/accept-offer/accept-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/trade-funds/accept-offer/accept-offer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './accept-offer.less'
import view from './accept-offer.stache'
import currencyConverter from '~/utils/currency-converter'

export const ViewModel = DefineMap.extend({
  tx: '*',

  // Flow type: Ask | Bid
  flowType: {
    get () {
      // If we accept an offer during Ask flow we send securities (EQB):
      return this.tx && this.tx.currencyType === 'EQB' ? 'Ask' : 'Bid'
    }
  },

  issuance: '*',
  portfolio: '*',
  offer: '*',
  offerTimelock: {
    get: function () {
      return this.offer && this.offer.timelockInfo ? this.offer.timelockInfo.fullBlocksRemaining : this.tx.timelock * 2
    }
  },
  formData: {
    get () {
      const tx = this.tx
      const issuance = this.issuance || {}
      return new DefineMap({
        type: tx.currencyType,
        assetType: tx.assetType,
        address: tx.toAddress,
        issuanceName: issuance && (issuance.companyName + ', ' + issuance.issuanceName),
        quantity: tx.amount,
        fee: tx.fee,
        amountMinusFee: (tx.amount - tx.fee),
        totalAmount: (tx.amount + tx.fee),
        // timelock is in blocks (10min per block)
        timelock: Math.floor(tx.timelock / 6),
        description: tx.description,
        offerTimelock: Math.floor(this.offerTimelock / 6),
        portfolioName: this.portfolio.name,
        // For the Ask flow calc shares price in Satoshi:
        price: this.flowType === 'Ask' ? tx.amount * this.offer.price : 0
      })
    }
  },
  convertToUSD: function (value, type) {
    // This is used for:
    // 1. BTC for Bid (both amount and fee in BTC)
    // 2. BTC for Ask (price of shares in BTC)
    // 3. EQB for Ask (fee of empty EQB) // DAVID
    return currencyConverter.convertToUserFiat(value, type, currencyConverter.satoshi)
  },
  sendFn: '*',
  isSending: {
    value: false
  },
  send (close) {
    // Here timelock is in hours, but transaction works with blocks (10min per block).
    this.isSending = true
    this.sendFn(this.formData.timelock * 6, this.formData.description)
      .then(() => {
        this.isSending = false
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
  tag: 'accept-offer',
  ViewModel,
  view
})
