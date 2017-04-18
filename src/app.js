/**
 * @module {can-map} wallet-ui/app AppViewModel
 * @parent wallet-ui
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

import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';
import Session from '~/models/session';
// import '~/models/fixtures/fixtures';

var pages = {
  home: 'public',
  loading: 'public',
  signup: 'public',
  login: 'public',
  issuances: 'public',
  'issuance-details': 'public',
  'four-oh-one': 'public',
  'forgot-password': 'public',
  'change-password': 'private',
  dashboard: 'private',
  settings: 'private',
  portfolio: 'private'
};

const AppViewModel = DefineMap.extend({
  '*': {
    serialize: false
  },
  title: {
    value: 'wallet-ui'
  },

  /**
   * @property {wallet-ui/app.session} wallet-ui/app.session session
   * @parent wallet-ui/app.properties
   * A session object that get's created on successful user login.
   */
  session: {
    Type: Session
  },
  get isLoggedIn () {
    return !!(this.session && this.session.user);
  },

  /**
   * Page component of the route.
   */
  page: {
    serialize: true
  },

  /**
   * Determines which page-level component is displayed.
   */
  displayedPage: {
    get () {
      let page = this.page;

      if (!this.session) {
        page = pages[page] === 'private' ? 'four-oh-one' : page;
      }
      return pages[page] ? page : 'four-oh-four';
    }
  },

  companySlug: 'string',
  issuanceId: 'string',

  logout () {
    // TODO: what do we call in feathers to logout?
    // this.session.user.logout();
    this.session = null;
    this.page = 'home';
  }
});

route('issuances/{companySlug}/{issuanceId}', {page: 'issuances'});
route('{page}', {page: 'home'});

export default AppViewModel;
