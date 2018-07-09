/**
 * @module {can-map} wallet-ui/app AppViewModel
 * @parent models
 *
 * Application view model.
 *
 * Usage:
 * ```
 * <can-import from="wallet-ui/app" export-as="viewModel" />
 * ```
 *
 * @group wallet-ui/app.properties 0 properties
 */

import 'core-js/client/core'
import DefineMap from 'can-define/map/map'
import route from 'can-route'
import 'can-route-pushstate'
import Session from './models/session'
import Transaction from './models/transaction/transaction'
import { clearLogoutTimer } from '~/utils/logout-timer'
import Client from './models/feathers-client'

//! steal-remove-start
import canViewModel from 'can-view-model'
window.route = route
window.Session = Session
window.canViewModel = canViewModel
//! steal-remove-end

const pages = {
  home: 'public',
  loading: 'public',
  signup: 'public',
  login: 'public',
  research: 'public',
  issuances: 'public',
  equibit: 'public',
  'issuance-details': 'public',
  'four-oh-one': 'public',
  'forgot-password': 'public',
  'change-password': 'private',
  'recovery-phrase': 'private',
  dashboard: 'private',
  settings: 'private',
  portfolio: 'private',
  preferences: 'private',
  transactions: 'private',
  'my-issuances': 'private',
  'my-trading-passports': 'private',
  'my-inbox': 'private',
  orders: 'private',
  offers: 'private',
  'free-eqb': 'private'
}

const AppViewModel = DefineMap.extend({
  '*': {
    serialize: false
  },

  /**
   * Route params.
   */
  page: {
    serialize: true
  },
  companySlug: {
    serialize: true
  },
  itemId: {
    serialize: true
  },
  sort: {
    serialize: true
  },

  // Rates for anonymous user: BTC/USD EQB/USD

  /**
   * @property {wallet-ui/app.session} wallet-ui/app.session session
   * @parent wallet-ui/app.properties
   * A session object that get's created on successful user login.
   */
  // TODO: consider using Session.current in a getter and do not pass session to other pages via template bindings.
  session: {
    // 1. user prefs for local currency rates.
    // 2. transaction fees are only needed for a logged in user. Also, might be that user prefers priority rates always.
    Type: Session,
    set (val) {
      return val
    }
  },
  get isLoggedIn () {
    return !!(this.session && this.session.user)
  },

  /**
   * Determines which page-level component is displayed.
   */
  displayedPage: {
    get () {
      let page = this.page

      if (!this.session) {
        page = pages[page] === 'private' ? 'four-oh-one' : page
      }
      return pages[page] ? page : 'four-oh-four'
    }
  },

  logout () {
    // TODO: what do we call in feathers to logout?
    clearLogoutTimer()
    this.session.user.clearKeys()
    this.session.destroy()
    this.session = null
    Transaction.unSubscribe()
    if (pages[this.page] === 'private') {
      this.page = 'login'
    }
    setTimeout(() => {
      window.location.reload()
    }, 100)
    Client.logout()
  },

  refresh () {
    if (this.session) {
      this.session.refreshBalance()
    }
  }
})

route('issuances/sort/{sort}', {page: 'issuances'})
route('issuances/{companySlug}/{itemId}', {page: 'issuance-details'})
route('{page}/{itemId}')
route('{page}', {page: 'login'})

window.route = route

export default AppViewModel
