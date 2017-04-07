/**
 *
 * @module {can.Component} components/page-auth Page Authentication
 * @parent components.auth
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
