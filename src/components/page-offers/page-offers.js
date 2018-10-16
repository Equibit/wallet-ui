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
        return Offer.getList({
          userId: Session.current.user._id,
          $skip: 0,
          $limit: 1000
        })
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
      if (this.offers) {
        this.selectedItem = this.offers.filter(o => o._id === val)[0]
      } else {
        this.offersPromise.then(offers => {
          this.selectedItem = offers.filter(o => o._id === val)[0]
        })
      }
    }
  },
  mode: {
    get (val) {
      return val || 'SELL'
    },
    set () {
      // Reset selected item
      this.selectedItem = null
    },
    value () {
      return 'SELL'
    }
  }
})

export default Component.extend({
  tag: 'page-offers',
  ViewModel,
  view
})
