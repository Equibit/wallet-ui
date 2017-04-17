/**
 * @module {can.Component} components/page-auth page-auth
 * @parent components.auth
 *
 * Page Authentication
 *
 * @signature `<page-auth {(session)}="session" {page}="page" />`
 *
 *  @param {models/session} session A reference to the {models/session} instance
 *  @param {String} page A reference to the route's param `page`
 *
 * @link ../src/components/page-auth/page-auth.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-auth/page-auth.html
 *
**/

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-auth.stache';

export const ViewModel = DefineMap.extend({
  email: 'string',
  session: {
    type: 'any'
  }
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  view
});
