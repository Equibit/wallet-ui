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
  issuanceId: {
    type: 'string',
    set (val) {
      Issuance.get({_id: val}).then(issuance => {
        this.issuance = issuance
      })
      return val
    }
  },
  issuance: {
    type: '*'
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
  investor () {
    this.mode = 'investor'
  },
  admin () {
    this.mode = 'admin'
  },
  switch (modeContent) {
    this.modeContent = modeContent
  }
})

export default Component.extend({
  tag: 'page-issuance-details',
  ViewModel,
  view
})
