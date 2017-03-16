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
import 'can-route';
import 'can-route-pushstate';

const AppViewModel = DefineMap.extend({
  message: {
    value: 'Hello World!',
    serialize: false
  },
  title: {
    value: 'wallet-ui',
    serialize: false
  }
});

export default AppViewModel;
