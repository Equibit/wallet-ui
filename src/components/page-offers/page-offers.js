/**
 * @module {can.Component} components/page-offers page-offers
 * @parent components.pages
 *
 * This is the page where buy and sell offers show.
 *
 * @signature `<page-offers />`
 *
 * @link ../src/components/page-offers/page-offers.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/components/page-offers/page-offers.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-offers.less'
import view from './page-offers.stache'
import Session from '../../models/session'
import Offer from '../../models/offer'

export const ViewModel = DefineMap.extend({
  offersPromise: {
    get (val) {
      if (Session.current) {
        return Offer.getList({userId: Session.current.user._id})
      }
    }
  },
  offers: {
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.offersPromise) {
        this.offersPromise.then(resolve)
      }
    }
  },
  selectedOffer: {
    get (val) {
      if (val) {
        return val
      }
      const offer = this.offers && this.offers.length && this.offers[0]
      if (offer) {
        this.offers.selectItem(offer)
      }
      return offer
    }
  }
})

export default Component.extend({
  tag: 'page-offers',
  ViewModel,
  view
})
