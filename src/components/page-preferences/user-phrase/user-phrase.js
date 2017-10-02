/**
 * @module {can.Component} components/page-preferences/user-phrase user-phrase
 * @parent components.user-preferences
 *
 * A short description of the user-phrase component
 *
 * @signature `<user-phrase />`
 *
 * @link ../src/components/page-preferences/user-phrase/user-phrase.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/scomponents/page-preferences/user-phrase/user-phrase.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './user-phrase.less'
import view from './user-phrase.stache'

export const ViewModel = DefineMap.extend({
  secondFactorCode: 'string',
  isAuthModalShown: 'boolean',
  isPhraseModalShown: 'boolean',

  codeVerified (args) {
    const code = args[1]
    console.log('codeVerified!!! ' + code)
    this.secondFactorCode = code
    this.isPhraseModalShown = true
  },
  showAuthModal () {
    this.isAuthModalShown = true
  },
  onClose (prop) {
    this[prop] = false
  }
})

export default Component.extend({
  tag: 'user-phrase',
  ViewModel,
  view
})
