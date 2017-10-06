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
import Session from '../../../models/session'
import hub from '../../../utils/event-hub'
import { translate } from '~/i18n/'

export const ViewModel = DefineMap.extend({
  portfolio: '*',
  issuance: '*',
  get session () {
    return Session.current
  },

  isModalShown: 'boolean',
  showModal () {
    // Note: we need to re-insert the modal content:
    this.isModalShown = false
    this.isModalShown = true
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
      issuanceType: this.issuance.issuanceType,
    })
    order.save(() => {
      hub.dispatch({
        'type': 'alert',
        'kind': 'success',
        'title': translate('orderWasCreated'),
        'displayInterval': 5000
      })
      // TODO: See https://github.com/Equibit/wallet-ui/issues/486
      // Refresh promise to cause repaint of grid with Market Depth background (which does not support row updates).
      this[type === 'SELL' ? 'resetSellOrders' : 'resetBuyOrders'] = Math.random()
    })
  },
  resetSellOrders: '*',
  resetBuyOrders: '*'
})

export default Component.extend({
  tag: 'order-book',
  ViewModel,
  view
})
