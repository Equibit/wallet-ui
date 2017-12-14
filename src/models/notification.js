import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import accounting from 'accounting'
import { toMaxPrecision } from '../utils/formatter'

const Notification = DefineMap.extend('Notification', {
  _id: 'string',
  type: 'string',
  address: 'string',
  currencyType: 'string',
  issuanceType: 'string',
  amount: 'number',
  isRead: 'boolean',
  transactionId: 'string',

  get amountFormatted () {
    return this.issuanceType
      ? accounting.formatMoney(this.amount, '', 0)
      : toMaxPrecision(this.amount / 100000000, 6)
  },

  get units () {
    return this.issuanceType
      ? (this.issuanceType === 'common_shares' ? 'Shares' : 'Units')
      : this.currencyType
  }
})

Notification.List = DefineList.extend('NotificationList', {
  '#': Notification
})

export default Notification
