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
import './order-book.less'
import view from './order-book.stache'
import Order from '../../../models/order'
import Offer from '../../../models/offer'
import Session from '../../../models/session'
// import Transaction from '../../../models/transaction'
import hub from '../../../utils/event-hub'
import { translate } from '~/i18n/'
import BitMessage from '../../../models/bit-message'
import route from 'can-route'
import typeforce from 'typeforce'
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

  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
  },

  modalType: 'string',
  order: '*',
  isBuySellShown: 'boolean',
  openBuySellModal (args) {
    const type = args[1]
    const order = args[2]
    console.log(`openBuySellModal: ${type}, ${order.quantity}`)
    this.modalType = type
    this.order = order
    // Note: we need to re-insert the modal content:
    this.isBuySellShown = false
    this.isBuySellShown = true
  },

  isViewAllShown: 'boolean',
  showViewAll () {
    // Note: we need to re-insert the modal content:
    this.isViewAllShown = false
    this.isViewAllShown = true
  },

  /**
   * Places a new order The following actions are taken:
   *   1. Generate next available address.
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

    return this.portfolio.getNextAddress()
      .then(addr => createOrder(formData, type, addr, Session.current.user, this.portfolio, this.issuance))
      .then(order => {
        return this.sendMessage(order, this.issuance.keys.keyPair)
          .then(() => order.save())
          .then(() => dispatchAlertOrder(hub, route))
          .then(() => order)
      })
  },

  /**
   * Places a new offer The following actions are taken:
   *   1. Generate a secret for HTLC and create an offer (do not save yet).
   *   2. Create HTLC transaction from the offer and save (send it to blockchain and save to DB).
   *   3. On success save offer to DB
   * @param args
   * @returns {Promise.<Order>}
   */
  placeOffer (args) {
    typeforce(typeforce.tuple('FormData', 'String'), [args[1], args[2]])
    const formData = args[1]
    const type = args[2]
    console.log(`placeOffer: ${type}`, formData)

    const secret = generateSecret()
    const offer = createHtlcOffer(formData, type, secret, Session.current.user, this.issuance)
    const tx = createHtlcTx(offer)
    tx.save()
      .then(tx => saveOffer(offer, tx))
      .then(offer => dispatchAlertOffer(hub, offer, route))

    return offer
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
    {BTC: 'String', EQB: 'String'},
    'User',
    'Portfolio',
    'Issuance'
  ), arguments)
  const order = new Order({
    userId: user._id,
    issuanceAddress: issuance.issuanceAddress,
    type,
    sellAddressBtc: (type === 'SELL' ? addr.BTC : ''),
    buyAddressEqb: (type === 'BUY' ? addr.EQB : ''),
    portfolioId: portfolio._id,
    quantity: formData.quantity,
    price: formData.price,
    isFillOrKill: formData.isFillOrKill,
    goodFor: formData.goodFor,
    companyName: issuance.companyName,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType
  })
  return order
}

function generateSecret () {
  return cryptoUtils.randomBytes(32)
}

function createHtlcOffer (formData, type, secret, user, issuance) {
  console.log('createHtlcOffer', arguments)
  typeforce(typeforce.tuple('FormData', 'String', 'Buffer', 'User', 'Issuance'), arguments)

  const secretEncrypted = user.encrypt(secret.toString('hex'))
  const secretHash = cryptoUtils.sha256(secret).toString('hex')
  const offer = new Offer({
    userId: user._id,
    orderId: formData.order._id,
    issuanceAddress: issuance.issuanceAddress,
    secretEncrypted,
    secretHash,
    type,
    quantity: formData.quantity,
    price: formData.order.price,
    companyName: issuance.companyName,
    issuanceName: issuance.issuanceName,
    issuanceType: issuance.issuanceType
  })
  return offer
}

function saveOffer (offer, tx) {
  offer.tx = tx
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
  const offerUrl = route.url({ page: 'offers', itemId: offer._id })
  return hub.dispatch({
    'type': 'alert',
    'kind': 'success',
    'title': translate('offerWasCreated'),
    'message': `<a href="${offerUrl}">${translate('viewDetails')}</a>`,
    'displayInterval': 10000
  })
}

/**
 * Creates HTLC transaction with H(x).
 */
function createHtlcTx (formData, changeAddr) {
  // const amount = formData.amount
  // const currencyType = formData.fundsType
  // const toAddress = formData.toAddress
  // const txouts = this.portfolio
  //   .getTxouts(amount + formData.transactionFee, currencyType)
  //   .map(a => merge(a, {keyPair: this.portfolio.findAddress(a.address).keyPair}))
  // const options = {
  //   fee: formData.transactionFee,
  //   changeAddr,
  //   type: 'OUT',
  //   currencyType,
  //   description: formData.description
  // }
  // return Transaction.makeTransaction(amount, toAddress, txouts, options)
}

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
})

export {
  createHtlcOffer,
  generateSecret,
  createHtlcTx
}
