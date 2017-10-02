import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'

const Notification = DefineMap.extend('Notification', {
  _id: 'string',
  type: 'string',
  address: 'string',
  currencyType: 'string',
  amount: 'number',
  isRead: 'boolean',
  transactionId: 'string'
})

Notification.List = DefineList.extend('NotificationList', {
  '#': Notification
})

export default Notification
