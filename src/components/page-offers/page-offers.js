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
  selectedItem: {
    get (val) {
      if (typeof val !== 'undefined') {
        return val
      }
      const offer = this.offers && this.offers.length && this.offers[0]
      if (offer) {
        this.offers.selectItem(offer)
      }
      return offer
    }
  },
  selectedItemId: {
    get () {
      return this.selectedItem && this.selectedItem._id
    },
    set (val) {
      this.selectedItem = this.offers
        ? this.offers.filter(o => o._id === val)[0]
        : this.offersPromise.then(offers => offers.filter(o => o._id === val)[0])
    }
  }
})

export default Component.extend({
  tag: 'page-offers',
  ViewModel,
  view
})
