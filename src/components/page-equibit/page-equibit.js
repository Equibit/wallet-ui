/**
 * @module {can.Component} components/page-equibit page-equibit
 * @parent components.pages
 *
 * Page Equibit
 *
 * @signature `<page-equibit portfolio:from="portfolio" />`
 *
 * @link ../src/components/page-equibit/page-equibit.html Full Page Demo
 * ## Example
 *
 * @demo src/components/page-equibit/page-equibit.html
 *
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/map'
import './page-equibit.less'
import view from './page-equibit.stache'

export const ViewModel = DefineMap.extend({
  hasOrders: 'boolean',

  // To show Buy/Sell modal:
  isCreateOrderModalShown: 'boolean',

  // Type of the modal: SELL | BUY
  newOrderType: 'string',

  investor () {
    this.mode = 'investor'
  },
  admin () {
    this.mode = 'admin'
  },
  switch (modeContent) {
    this.isCreateOrderModalShown = false
    this.modeContent = modeContent
  },
  placeSellOrder (type) {
    this.newOrderType = type
    this.isCreateOrderModalShown = false
    this.isCreateOrderModalShown = true
  }
})

export default Component.extend({
  tag: 'page-equibit',
  ViewModel,
  view
})
