/**
 * @module {can.Component} wallet-ui/components/inbox/inbox-list inbox-list
 * @parent components.common
 *
 * A short description of the inbox-list component
 *
 * @signature `<inbox-list />`
 *
 * @link ../src/wallet-ui/components/inbox/inbox-list/inbox-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/inbox/inbox-list/inbox-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './inbox-list.less'
import view from './inbox-list.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the inbox-list component'
  }
})

export default Component.extend({
  tag: 'inbox-list',
  ViewModel,
  view
})
