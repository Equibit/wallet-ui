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
    const userHasPortfolioIssuances = this.session &&
      this.session.portfolios &&
      this.session.portfolios[0].securities &&
      this.session.portfolios[0].securities.filter(sec => {
        return sec.data.issuance.issuance_address === this.issuance.issuanceAddress
      })[0]
    const userHasAuthorizedIssuancesUtxo = this.session &&
      this.session.issuances &&
      this.session.issuances.filter(issuance => {
        return issuance.issuanceAddress === this.issuance.issuanceAddress && issuance.utxo && issuance.utxo.length
      })[0]
    return userHasPortfolioIssuances || userHasAuthorizedIssuancesUtxo
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
   * @param args
   * @returns {Promise.<Order>}
   */
  placeOrder (args) {
    typeforce(typeforce.tuple('FormData', 'String'), [args[1], args[2]])
    const formData = args[1]
    const type = args[2]
    console.log(`placeOrder: ${type}`, formData)

    return Promise.all([Session.current.issuancesPromise, this.portfolio.getNextAddress()])
      .then(([issuances, addr]) => {
        // todo: figure out a better way to "sync" this issuance with the list of issuances in Session.
        const issuance = issuances.filter(issuance => issuance._id === this.issuance._id)[0]
        const receiveAddr = addr.BTC
        return createOrder(formData, type, receiveAddr, Session.current.user, this.portfolio, issuance)
      })
      .then(order => {
        return this.sendMessage(order, this.issuance.keys.keyPair)
          .then(() => order.save())
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
   * @param args
   * @returns {Promise.<Order>}
   */
  // HTLC 1: place payment.
  placeOffer (args) {
    typeforce('OfferFormData', args[1])
    const formData = args[1]
    console.log('placeOffer: ', formData)

    const secret = generateSecret()
    return Promise.all([
      // EQB address to receive securities, BTC address for refund
      this.portfolio.getNextAddress(),
      // Change address:
      this.portfolio.getNextAddress(true)
    ]).then(([addr, change]) => {
      const receiveAddr = addr.EQB
      // Note: we need to store the refundAddr on the offer because it will be used in HTLC.
      const refundAddr = addr.BTC
      const changeAddr = change.BTC
      const offer = createHtlcOffer(formData, secret, formData.timelock, Session.current.user, this.issuance, receiveAddr, refundAddr)
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
    btcAddress: addr,             // to receive payment
    eqbAddress: '',               // will be populated when we create a transaction (from UTXO)
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

function createHtlcOffer (formData, secret, timelock, user, issuance, eqbAddress, refundBtcAddress) {
  typeforce(typeforce.tuple(
    'OfferFormData', 'Buffer', 'Number', 'User', 'Issuance', types.Address, types.Address),
    arguments
  )

  const secretEncrypted = user.encrypt(secret.toString('hex'))
  const hashlock = cryptoUtils.sha256(secret).toString('hex')
  const offer = new Offer({
    userId: user._id,
    orderId: formData.order._id,
    issuanceAddress: issuance.issuanceAddress,
    btcAddress: refundBtcAddress,
    // Main addr for receiving securities:
    eqbAddress,
    secretEncrypted,
    hashlock,
    timelock,
    type: formData.order.type === 'SELL' ? 'BUY' : 'SELL',
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
  // todo: what should offer know about the transaction?
  offer.htlcTxId1 = tx.txId
  return offer.save()
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

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
})

export {
  createHtlcOffer,
  generateSecret
}
