/**
 * @module {can.Component} components/page-issuances-details page-issuance-details
 * @parent components.pages
 *
 * Page Issuance Details
 *
 * @signature `<page-issuance-details {issuance-id}="issuanceId" />`
 *
 * @link ../src/components/page-issuance-details/page-issuance-details.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-issuance-details/page-issuance-details.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-issuance-details.less'
import view from './page-issuance-details.stache'
import Issuance from '~/models/issuance'

export const ViewModel = DefineMap.extend({
  issuanceId: 'string',
  issuancePromise: {
    get (val) {
      if (val) {
        return val
      }
      if (this.issuanceId) {
        return Issuance.get({_id: this.issuanceId})
      }
    }
  },
  issuance: {
    get (val, resolve) {
      this.issuancePromise.then(resolve)
    }
  },
  mode: {
    value: 'investor'
  },
  modeContent: {
    value: 'market',
    get (val) {
      return this.mode === 'investor' ? 'market' : val
    }
  },
  hasOrders: 'boolean',
  isCreateOrderModalShown: 'boolean',
  investor () {
    this.mode = 'investor'
  },
  admin () {
    this.mode = 'admin'
  },
  switch (modeContent) {
    this.isCreateOrderModalShown = false
    this.modeContent = modeContent
  },
  placeSellOrder () {
    this.isCreateOrderModalShown = false
    this.isCreateOrderModalShown = true
  }
})

export default Component.extend({
  tag: 'page-issuance-details',
  ViewModel,
  view
})
