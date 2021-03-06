/**
 * @module {can.Component} wallet-ui/components/page-transactions/transactions-grid/trade-row trade-row
 * @parent components.common
 *
 * A short description of the trade-row component
 *
 * @signature `<trade-row />`
 *
 * @link ../src/wallet-ui/components/page-transactions/transactions-grid/trade-row/trade-row.html Full Page Demo
 *
 * ## Example
 *
 * @demo src/wallet-ui/components/page-transactions/transactions-grid/trade-row/trade-row.html
 */

import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './trade-row.less'
import view from './trade-row.stache'
import { translate } from '~/i18n/'
import Session from '~/models/session'

export const ViewModel = DefineMap.extend({
  rows: '*',
  isUserAddress: '*',
  session: {
    value: function () {
      return Session.current
    }
  },
  transactionStepDescription (row) {
    const userSent = this.isUserAddress(row.fromAddress)
    const userReceived = this.isUserAddress(row.toAddress)
    const isRefund = row.type === 'REFUND'
    const sentOrCollected = row.htlcStep < 3 ? 'Sent' : (isRefund ? 'Refunded' : 'Collected')
    const isPayment = row.currencyType === 'BTC'
    const paymentOrSecurities = isPayment
      ? 'Payment'
      : (row.isSecurity ? 'Securities' : 'Equibits')

    const sellerBuyerOrUser = row.htlcStep < 3
      ? (userSent ? 'User' : (isPayment ? 'Buyer' : 'Seller'))
      : (userReceived ? 'User' : (isPayment ^ isRefund ? 'Seller' : 'Buyer'))

    const i18nKey = `htlc${sellerBuyerOrUser}${sentOrCollected}${paymentOrSecurities}Description`
    return translate(i18nKey)
  },
  // selectRow function to be overridden by parent component
  parentSelectRow () {},
  selectRow (object, el, ev) {
    const row = this.rows.filter(r => r._id === object._id)[0]
    this.parentSelectRow(row, el, ev)
  },
  tradeType (row) {
    const userSent = this.isUserAddress(row.fromAddress)
    const userReceived = this.isUserAddress(row.toAddress)
    const isCollected = row.htlcStep >= 3

    return isCollected
      ? (userReceived ? 'IN' : 'OUT')
      : (userSent ? 'USER-LOCK' : 'LOCK')
  }
})

export default Component.extend({
  tag: 'trade-row',
  ViewModel,
  view
})
