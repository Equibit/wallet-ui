/**
 * @module {can.Component} wallet-ui/components/page-trading-passports/trading-passports-list trading-passports-list
 * @parent components.common
 *
 * A short description of the trading-passports-list component
 *
 * @signature `<trading-passports-list />`
 *
 * @link ../src/wallet-ui/components/page-trading-passports/trading-passports-list/trading-passports-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-trading-passports/trading-passports-list/trading-passports-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './trading-passports-list.less'
import view from './trading-passports-list.stache'
import Session from '~/models/session'
import Issuance from '~/models/issuance'
import User from '~/models/user/'

export const ViewModel = DefineMap.extend({
  passports: {
    Type: [{
      name: 'string',
      status: 'string',
      authority: {}, // Has name, physical address, phone, website, email
      issuances: [Issuance], // Issuance list
      investors: [User] //  Investor list
    }],
    value: []
  },
  get issuancePassports () {
    return this.session.issuancePassports
  },
  activePassport: '*',
  offsetPage: {
    type: 'number',
    value: 1
  },
  mode: {
    type: 'string',
    value: 'RECEIVED'
  },
  isModalShown: {
    type: 'boolean',
    value: false
  },
  get session () {
    return Session.current
  },
  setActivePassport (val) {
    this.activePassport = val
  },
  showModal () {
    this.isModalShown = false
    this.isModalShown = true
  }
})

export default Component.extend({
  tag: 'trading-passports-list',
  ViewModel,
  view
})
