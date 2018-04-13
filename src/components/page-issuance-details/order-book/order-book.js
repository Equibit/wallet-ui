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
// import Transaction from '../../../models/transaction/transaction'
import hub, { dispatchAlertError } from '../../../utils/event-hub'
import BitMessage from '../../../models/bit-message'
import cryptoUtils from '../../../utils/crypto'
import feathersClient from '~/models/feathers-client'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  assetType: {
    default: 'ISSUANCE'
  },
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
  offer: '*',
  isBuySellShown: 'boolean',

  // Create an offer modal:
  /**
   * @property {Function} components/order-book/openBuySellModal openBuySellModal
   * Opens offer modal
   * The modal has two steps:
   *    1. Ask user for the offer quantity.
   *    2. Show tx details and ask for timelock and description.
   * Fee estimation depends only on the quantity (step1) and rate.
   * Keep in mind that in future user should be able to choose a rate (regular/priority/custom).
   * The final transaction can be built only when user picks a timelock (step2).
   * @param args
   * @returns {Promise.<TResult>}
   */
  openBuySellModal (args) {
    // The popup modal will update amount and description.
    // So, we have to build tx and estimate fee inside the modal.
    // Here we
    // 1. Create a new offer, setting amount either to 0 or to order.amount (based on fillOrKill).
    // 2. Open dialog:
    //    a. enter amount
    //    b. choose default timelock, fee rate; create a transaction; build transaction
    // 3. On confirm we:
    //    - save transaction
    //    - save offer

    const order = this.order = args[1]
    const secret = generateSecret()
    const defaultTimelock = 288

    // Ask flow: EQB address to receive securities, BTC address for refund
    return this.portfolio.getNextAddress().then((addrPair) => {
      // Case Issuer Ask Flow: when the original issuer buys an issuance it should go back to its issuance address (not to portfolio)
      if (order.assetType !== 'EQUIBIT') {
        const isIssuer = order.type === 'SELL' && this.issuance.userId === Session.current.user._id
        if (isIssuer) {
          addrPair.EQB = this.issuance.issuanceAddress
        }
      }

      // Note: we need to store the refund address on the offer because it will be used in HTLC.
      // Note: we don't know the amount yet.
      this.offer = createHtlcOffer(order, secret, defaultTimelock, '', Session.current.user, this.issuance, addrPair)

      // Open modal (we need to re-insert the modal component):
      this.isBuySellShown = false
      this.isBuySellShown = true
    }).catch(dispatchAlertError)
  },

  get userPortfolioForIssuance () {
    return (this.assetType === 'ISSUANCE' && this.session.hasIssuanceUtxo(this.issuance.issuanceAddress)) ||
      (this.assetType === 'EQUIBIT' && this.portfolio.utxoEmptyEqb.length)
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
        return createOrder(formData, type, receiveAddr, Session.current.user, this.portfolio, this.assetType, issuance)
      })
      .then(order => {
        // Note: for a sell order we use issuance keys which should be attached to this.issuance (both authorized and bought).
        // todo: figure out what keys to use for a BUY order.
        const keyPair = flowType === 'Ask'
          ? ((this.issuance && this.issuance.keys.keyPair) || this.portfolio.keys.EQB.keyPair)
          : this.portfolio.keys.BTC.keyPair

        return this.sendMessage(order, keyPair)
          .then(() => order.save())
          .then(order => updateIssuanceStat(this.assetType, this.issuance, order))
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
  placeOffer (offer, tx) {
    typeforce('Offer', offer)
    typeforce('Transaction', tx)
    console.log('placeOffer: ', offer, tx)
    return tx.save()
      .then(tx => saveOffer(offer, tx))
      .then(offer => dispatchAlertOffer(hub, offer, route))
      .then(() => markAsUsed(this.portfolio, offer))
      .then(() => { this.isBuySellShown = false })
      .catch(dispatchAlertError)
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

function createOrder (formData, type, addr, user, portfolio, assetType, issuance) {
  typeforce(typeforce.tuple(
    'FormData',
    'String',
    types.Address,
    'User',
    'Portfolio',
    'String',
    typeforce.maybe('Issuance')
  ), arguments)

  const order = new Order({
    userId: user._id,
    type,
    assetType,
    btcAddress: type === 'SELL' ? addr : '',            // to receive payment
    eqbAddress: type === 'BUY' ? addr : '',             // will be populated when we create a transaction (from UTXO)
    portfolioId: portfolio._id,
    quantity: formData.quantity,
    price: formData.priceInUnits,
    isFillOrKill: formData.isFillOrKill,
    goodFor: formData.goodFor
  })
  if (issuance) {
    order.assign({
      // todo: why do we need issuanceAddress at all??
      issuanceAddress: issuance.issuanceAddress,
      companyName: issuance.companyName,
      issuanceId: issuance._id,
      issuanceName: issuance.issuanceName,
      issuanceType: issuance.issuanceType
    })
  }
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
function createHtlcOffer (order, secret, timelock, description, user, issuance, addrPair) {
  typeforce(typeforce.tuple(
    'Order', 'Buffer', 'Number', '?String', 'User', typeforce.maybe('Issuance'),
    {EQB: types.Address, BTC: typeforce.maybe(types.Address)}),
    arguments
  )
  // Note: for Blank EQB trade there is no issuance.
  if (order.assetType === 'ISSUANCE') {
    typeforce('Issuance', issuance)
  }
  const flowType = order.type === 'SELL' ? 'Ask' : 'Bid'

  const secretEncrypted = user.encrypt(secret.toString('hex'))
  const hashlock = cryptoUtils.sha256(secret).toString('hex')
  const offer = new Offer({
    userId: user._id,
    orderId: order._id,
    // Ask: refund address | Bid: main receiving address:
    btcAddress: addrPair.BTC,
    // Ask: main address for receiving securities | Bid: will be populated from utxo.
    eqbAddress: flowType === 'Ask' ? addrPair.EQB : '',
    secretEncrypted,
    hashlock,
    timelock,
    type: flowType === 'Ask' ? 'BUY' : 'SELL',
    assetType: order.assetType,
    quantity: 0,
    price: order.price,
    description,
    htlcStep: 1
  })
  if (issuance) {
    offer.assign({
      issuanceAddress: issuance.issuanceAddress,
      issuanceId: issuance._id,
      companyName: issuance.companyName,
      issuanceName: issuance.issuanceName,
      issuanceType: issuance.issuanceType
    })
  }
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
    // Update both the placed transaction and its corresponding
    //  receiver transaction
    return feathersClient.service('/transactions').patch(null, {
      offerId: offer._id
    }, {
      query: {
        txId: tx.txId
      }
    })
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

function updateIssuanceStat (assetType, issuance, order) {
  // todo: stats should be updated on API side in order after-create hook.
  if (assetType === 'EQUIBIT') {
    return Promise.resolve(true)
  }
  if (order.type === 'SELL' && (!issuance.lowestAsk || issuance.lowestAsk > order.price)) {
    issuance.lowestAsk = order.price
    issuance.lowestNumShares = order.quantity
  }
  if (order.type === 'BUY' && (!issuance.highestBid || issuance.highestBid < order.price)) {
    issuance.highestBid = order.price
    issuance.highestNumShares = order.quantity
  }
  return issuance.save()
}

function markAsUsed (portfolio, offer) {
  // Ask flow:
  // - offer.btcAddress is refundAddress
  // - offer.eqbAddress is where securities will be sent by seller
  // Note: change address is marked as used by placeOffer view model.
  [
    {address: offer.btcAddress, currencyType: 'BTC', isChange: false},
    {address: offer.eqbAddress, currencyType: 'EQB', isChange: false}
  ].forEach(({address, currencyType, isChange}) => {
    portfolio.markAsUsed(address, currencyType, isChange)
  })
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
