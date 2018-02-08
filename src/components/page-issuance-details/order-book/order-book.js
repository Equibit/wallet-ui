/**
 * @module {can.Component} components/order-book order-book
 * @parent components.issuance-details
 *
 * Issuance Details / Order Book
 *
 * @signature `<order-book />`
 *
 * @link ../src/components/page-issuance-details/order-book/order-book.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/order-book/order-book.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import route from 'can-route'
import './order-book.less'
import typeforce from 'typeforce'
import { types } from '@equibit/wallet-crypto/dist/wallet-crypto'

import { translate } from '../../../i18n/i18n'
import view from './order-book.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Session from '../../../models/session'
import Transaction from '../../../models/transaction/transaction'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import BitMessage from '../../../models/bit-message'
import cryptoUtils from '../../../utils/crypto'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  issuance: '*',
  get session () {
    return Session.current
  },
  hasSellOrders: 'boolean',
  hasBuyOrders: 'boolean',
  hasOrders: {
    get () {
      return this.hasSellOrders || this.hasBuyOrders
    }
  },
  newOrderType: 'string',
  isModalShown: 'boolean',

  // Add new order modal:
  showModal (newOrderType) {
    // Note: we need to re-insert the modal content:
    this.newOrderType = newOrderType || 'SELL'
    this.isModalShown = false
    this.isModalShown = true
  },

  order: '*',
  isBuySellShown: 'boolean',

  // Create an offer modal:
  openBuySellModal (args) {
    this.order = args[1]
    // Note: we need to re-insert the modal content:
    this.isBuySellShown = false
    this.isBuySellShown = true
  },

  get userPortfolioForIssuance () {
    return this.session.hasIssuanceUtxo(this.issuance.issuanceAddress)
  },
  isViewAllShown: 'boolean',
  showViewAll () {
    // Note: we need to re-insert the modal content:
    this.isViewAllShown = false
    this.isViewAllShown = true
  },

  /**
   * Places a new order The following actions are taken:
   *   1. Generate next available address (e.g. to receive payment for Ask order).
   *   2. Create a new order.
   *   3. Send BitMessage message.
   *   4. Save the order and show notification.
   * @param formData
   * @param {String} type Type of the order: SELL | BUY
   * @returns {Promise.<Order>}
   */
  placeOrder (formData, type) {
    typeforce(typeforce.tuple('FormData', 'String'), arguments)
    const flowType = type === 'SELL' ? 'Ask' : 'Bid'
    console.log(`placeOrder: ${type}`, formData)

    return Promise.all([Session.current.issuancesPromise, this.portfolio.getNextAddress()])
      .then(([issuances, addr]) => {
        // Note: we need issuance keys to sign BitMessage which we do further below. Not sure why we grab it from session.
        // todo: figure out a better way to "sync" this issuance with the list of issuances in Session.
        // const issuance = issuances.filter(issuance => issuance._id === this.issuance._id)[0]
        const issuance = this.issuance
        const receiveAddr = flowType === 'Ask' ? addr.BTC : addr.EQB
        return createOrder(formData, type, receiveAddr, Session.current.user, this.portfolio, issuance)
      })
      .then(order => {
        // Note: for a sell order we use issuance keys which should be attached to this.issuance (both authorized and bought).
        // todo: figure out what keys to use for a BUY order.
        const keyPair = flowType === 'Ask' ? this.issuance.keys.keyPair : this.portfolio.keys.BTC.keyPair
        return this.sendMessage(order, keyPair)
          .then(() => order.save())
          .then(order => updateIssuanceStat(this.issuance, order))
          .then(() => dispatchAlertOrder(hub, route))
          .then(() => order)
      })
      .catch(dispatchAlertError)
  },

  /**
   * Places a new offer The following actions are taken:
   *   1. Generate a secret for HTLC and create an offer (do not save yet).
   *   2. Create HTLC transaction from the offer and save (send it to blockchain and save to DB).
   *   3. On success save offer to DB
   * @param formData
   * @returns {Promise.<Order>}
   */
  // HTLC 1: place payment.
  placeOffer (formData) {
    typeforce('OfferFormData', formData)
    console.log('placeOffer: ', formData)

    const flowType = formData.order.type === 'SELL' ? 'Ask' : 'Bid'

    const secret = generateSecret()
    return Promise.all([
      // Ask flow: EQB address to receive securities, BTC address for refund
      this.portfolio.getNextAddress(),
      // Change address:
      this.portfolio.getNextAddress(true)
    ]).then(([addrPair, change]) => {
      // Note: we need to store the refund address on the offer because it will be used in HTLC.
      // Bid flow: change address for Empty EQB.
      const changeAddr = flowType === 'Ask' ? change.BTC : change.EQB
      const offer = createHtlcOffer(formData, secret, formData.timelock, Session.current.user, this.issuance, addrPair)
      const tx = Transaction.createHtlc1(offer, formData.order, this.portfolio, this.issuance, changeAddr)

      // Here we have all info about the transaction we want to create (fees, etc).
      // We need to show a modal with the info here.

      return tx.save()
        .then(tx => saveOffer(offer, tx))
        .then(offer => dispatchAlertOffer(hub, offer, route))
    }).catch(dispatchAlertError)
  },
  sendMessage (order, keyPair) {
    const bitMessage = BitMessage.createFromOrder(order, keyPair)
    console.log(`bitMessage`, bitMessage)

    return bitMessage.send().then(res => {
      console.log(`Message was sent!`, res)
    }).catch(err => {
      console.log(`Message was NOT sent :(`, err)
    })
  }
})

function createOrder (formData, type, addr, user, portfolio, issuance) {
  typeforce(typeforce.tuple(
    'FormData',
    'String',
    types.Address,
    'User',
    'Portfolio',
    'Issuance'
  ), arguments)

  const order = new Order({
    userId: user._id,
    // todo: why do we need issuanceAddress at all??
    issuanceAddress: issuance.issuanceAddress,
    type,
    btcAddress: type === 'SELL' ? addr : '',            // to receive payment
    eqbAddress: type === 'BUY' ? addr : '',             // will be populated when we create a transaction (from UTXO)
    portfolioId: portfolio._id,
    quantity: formData.quantity,
    price: formData.priceInUnits,
    isFillOrKill: formData.isFillOrKill,
    goodFor: formData.goodFor,
    companyName: issuance.companyName,
    issuanceId: issuance._id,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType
  })
  return order
}

function generateSecret () {
  return cryptoUtils.randomBytes(32)
}

/**
 * Ask flow:
 *    - send (lock) payment
 *    - from: utxo
 *    - refund: new btcAddress (refundAddress)
 *    - receive securities to a new EQB address (receiveAddress)
 * Bid flow:
 *    - send (lock) securities
 *    - from: utxo
 *    - refund: utxo (the same as from address)
 *    - receive payment to a new BTC address (receiveAddress)
 *
 * @param formData
 * @param secret
 * @param timelock
 * @param user
 * @param issuance
 * @param addrPair
 */
// function createHtlcOffer (formData, secret, timelock, user, issuance, receiveAddress, refundAddress) {
function createHtlcOffer (formData, secret, timelock, user, issuance, addrPair) {
  typeforce(typeforce.tuple(
    'OfferFormData', 'Buffer', 'Number', 'User', 'Issuance', {EQB: types.Address, BTC: types.Address}),
    arguments
  )
  const flowType = formData.order.type === 'SELL' ? 'Ask' : 'Bid'

  const secretEncrypted = user.encrypt(secret.toString('hex'))
  const hashlock = cryptoUtils.sha256(secret).toString('hex')
  const offer = new Offer({
    userId: user._id,
    orderId: formData.order._id,
    issuanceAddress: issuance.issuanceAddress,
    // Ask: refund address | Bid: main receiving address:
    btcAddress: addrPair.BTC,
    // Ask: main address for receiving securities | Bid: will be populated from utxo.
    eqbAddress: flowType === 'Ask' ? addrPair.EQB : '',
    secretEncrypted,
    hashlock,
    timelock,
    type: flowType === 'Ask' ? 'BUY' : 'SELL',
    quantity: formData.quantity,
    price: formData.order.price,
    issuanceId: issuance._id,
    companyName: issuance.companyName,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType,
    description: formData.description,
    htlcStep: 1
  })
  console.log('createHtlcOffer', arguments, offer)
  return offer
}

function saveOffer (offer, tx) {
  offer.htlcTxId1 = tx.txId
  // Bid flow: save eqbAddress from transaction (from utxo):
  if (offer.type === 'SELL') {
    offer.eqbAddress = tx.fromAddress
  }
  return offer.save().then(() => {
    tx.offerId = offer._id
    return tx.save()
  }).then(() => offer)
}

function dispatchAlertOrder (hub, route) {
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate('orderWasCreated'),
    'displayInterval': 10000
  })
}

function dispatchAlertOffer (hub, offer, route) {
  if (!offer) {
    return
  }
  const offerUrl = route.url({ page: 'offers', itemId: offer._id })
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate('offerWasCreated'),
    'message': `<a href="${offerUrl}">${translate('viewDetails')}</a>`,
    'displayInterval': 10000
  })
}

function updateIssuanceStat(issuance, order) {
  if (order.type === 'SELL' && issuance.lowestAsk > order.price) {
    issuance.lowestAsk = order.price
    issuance.lowestNumShares = order.quantity
  }
  if (order.type === 'BUY' && issuance.highestBid < order.price) {
    issuance.highestBid = order.price
    issuance.highestNumShares = order.quantity
  }
  return issuance.save()
}

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
})

export {
  createHtlcOffer,
  generateSecret
}
