/**
 * @module {can.Component} wallet-ui/components/page-inbox page-inbox
 * @parent components.common
 *
 * A short description of the page-inbox component
 *
 * @signature `<page-inbox />`
 *
 * @link ../src/wallet-ui/components/page-inbox/page-inbox.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/page-inbox.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-inbox.less'
import view from './page-inbox.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the page-inbox component'
  }
})

export default Component.extend({
  tag: 'page-inbox',
  ViewModel,
  view
})
