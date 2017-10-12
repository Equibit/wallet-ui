/**
 * @module {can.Component} components/page-offers/offer-list offer-list
 * @parent components.buy-sell-offers 3
 *
 * This components shows a list of offers.
 *
 * @signature `<offer-list />`
 *
 * @link ../src/components/page-offers/offer-list/offer-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/offer-list/offer-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './offer-list.less'
import view from './offer-list.stache'
import { labelStatusMap } from '../../page-offers/page-offers/offer-list/offer-list'

export const ViewModel = DefineMap.extend({
  mode: {
    get (val) {
      return val || 'SELL'
    }
  },
  offers: '*',
  offersFiltered: {
    get () {
      return this.offers && this.offers.filter(offer => {
          return this.mode === 'ARCHIVE'
            ? ['CLOSED', 'CANCELLED'].indexOf(offer.status) !== -1
            : ['CLOSED', 'CANCELLED'].indexOf(offer.status) === -1 && offer.type === this.mode
        })
    }
  },
  switchMode (mode) {
    this.mode = mode
  },
  toLabel (status) {
    return labelStatusMap[status] || labelStatusMap.OPEN
  },
  selectOffer (offer) {
    this.selectedOffer = offer
  },
  selectedOffer: {
    set (offer) {
      if (!this.offers || !this.offers.length) {
        return
      }
      if (!offer) {
        offer = this.offers[0]
      }
      this.offers.forEach(offer => {
        offer.isSelected = false
      })
      offer.isSelected = true
      return offer
    }
  }
})

export default Component.extend({
  tag: 'offer-list',
  ViewModel,
  view
})
