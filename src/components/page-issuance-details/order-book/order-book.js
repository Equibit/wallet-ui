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
import hub from '../../../utils/event-hub'
import { translate } from '~/i18n/'
import BitMessage from '../../../models/bit-message'
import route from 'can-route'

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
  placeOrder (args) {
    const formData = args[1]
    const type = args[2]
    console.log(`placeOrder: ${type}`, formData)
    if (!formData) {
      console.error('Error: received no form data')
    }
    const order = new Order({
      userId: Session.current.user._id,
      issuanceAddress: this.issuance.issuanceAddress,
      type,
      portfolioId: this.portfolio._id,
      quantity: formData.quantity,
      price: formData.price,
      isFillOrKill: formData.isFillOrKill,
      goodFor: formData.goodFor,
      companyName: this.issuance.companyName,
      issuanceName: this.issuance.issuanceName,
      issuanceType: this.issuance.issuanceType
    })
    return this.sendMessage(order, this.issuance.keys.keyPair)
      .then(() => order.save())
      .then(() => {
        hub.dispatch({
          'type': 'alert',
          'kind': 'success',
          'title': translate('orderWasCreated'),
          'displayInterval': 5000
        })
        // TODO: Refresh Market Depth background. See https://github.com/Equibit/wallet-ui/issues/486
        return order
      })
  },
  placeOffer (args) {
    const formData = args[1]
    const type = args[2]
    console.log(`placeOffer: ${type}`, formData)
    if (!formData) {
      console.error('Error: received no form data')
    }
    const offer = new Offer({
      userId: Session.current.user._id,
      orderId: formData.order._id,
      issuanceAddress: this.issuance.issuanceAddress,
      type,
      quantity: formData.quantity,
      price: formData.order.price,
      companyName: this.issuance.companyName,
      issuanceName: this.issuance.issuanceName,
      issuanceType: this.issuance.issuanceType
    })
    offer.save().then(() => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': translate('offerWasCreated'),
        'message': '<a href="' +
          route.url({ page: 'offers', itemId: offer._id }) +
          '">' + translate('viewDetails') +
          '</a>',
        'displayInterval': 5000
      })
    })
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

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
})
