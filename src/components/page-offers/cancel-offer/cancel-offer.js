/**
 * @module {can.Component} components/page-offers/cancel-offer cancel-offer
 * @parent components.buy-sell-offers 8
 *
 * Modal shown when wanting to cancel an order.
 *
 * @signature `<cancel-offer />`
 *
 * @link ../src/components/page-offers/cancel-offer/cancel-offer.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/cancel-offer/cancel-offer.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './cancel-offer.less'
import view from './cancel-offer.stache'
import Offer from '~/models/offer'

export const ViewModel = DefineMap.extend({
  offer: Offer,
  closeModal: '*',
  mode: 'string',
  confirm () {
    // a reference to this.offer must be retained because once its status changes
    // to 'CANCELLED' it will immediately be moved to the ARCHIVED tab and this tab
    // will loose reference to it.
    const offer = this.offer
    offer.status = 'CANCELLED'
    offer.save().then(() => {
      this.closeModal()
      this.mode = 'ARCHIVE'
    })
  }
})

export default Component.extend({
  tag: 'cancel-offer',
  ViewModel,
  view
})
