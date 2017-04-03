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
// import '~/models/fixtures/fixtures';

var pages = {
  home: 'public',
  signup: 'public',
  login: 'public',
  forgot: 'public',
  'change-password': 'public',
  dashboard: 'private',
  settings: 'private',
  loading: 'public'
};

const AppViewModel = DefineMap.extend({
  message: {
    value: 'Hello World!',
    serialize: false
  },
  title: {
    value: 'wallet-ui',
    serialize: false
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
        page = pages[page] === 'private' ? 'login' : page;
      }
      return pages[page] ? page : 'four-oh-four';
    }
  }
});

route('{page}', {page: 'home'});

export default AppViewModel;
