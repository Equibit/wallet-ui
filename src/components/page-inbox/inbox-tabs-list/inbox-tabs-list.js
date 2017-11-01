/**
 * @module {can.Component} wallet-ui/components/page-inbox/inbox-tabs-list inbox-tabs-list
 * @parent components.common
 *
 * A short description of the inbox-tabs-list component
 *
 * @signature `<inbox-tabs-list />`
 *
 * @link ../src/wallet-ui/components/page-inbox/inbox-tabs-list/inbox-tabs-list.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-inbox/inbox-tabs-list/inbox-tabs-list.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './inbox-tabs-list.less'
import view from './inbox-tabs-list.stache'

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the inbox-tabs-list component'
  }
})

export default Component.extend({
  tag: 'inbox-tabs-list',
  ViewModel,
  view
})
