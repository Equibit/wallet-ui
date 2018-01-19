/**
 * @module {can.Component} components/nav-bar nav-bar
 * @parent components.common
 *
 * Global navbar.
 *
 * @signature `<nav-bar {page}="page" {logout}="@logout" {is-logged-in}="isLoggedIn" />`
 *
 *  @param {String} page A reference to the route param `page`.
 *  @param {Function} logout A function to be called on logout button click.
 *  @param {Boolean} isLoggedIn Navbar has two states logged in and anonymous to show hide relevant controls.
 *
 * @link ../src/components/nav-bar/nav-bar.html Full Page Demo
 * ## Example
 *
 * @demo src/components/nav-bar/nav-bar.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './nav-bar.less'
import view from './nav-bar.stache'

export const ViewModel = DefineMap.extend({
  page: 'string',
  isLoggedIn: 'boolean',
  balance: {
    type: '*'
  },
  notifications: {
    type: '*'
  },
  isLoading: 'boolean',
  refresh: function () {},
  logout: function () {}
})

export default Component.extend({
  tag: 'nav-bar',
  ViewModel,
  view
})
