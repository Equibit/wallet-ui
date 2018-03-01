import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import accounting from 'accounting'
import { toMaxPrecision } from '../utils/formatter'
import feathersClient from './feathers-client'
import { superModelNoCache } from './super-model'
import algebra from './algebra'

const Notification = DefineMap.extend('Notification', {
  subscribe (cb) {
    feathersClient.service('/notifications').on('created', data => {
      cb(data)
    })
  },
  unSubscribe () {
    feathersClient.service('/notifications').removeListener('created')
  }
}, {
  _id: 'string',
  type: 'string',
  address: 'string',
  data: DefineMap,

  get amountFormatted () {
    return this.data.issuanceType
      ? accounting.formatMoney(this.data.amount, '', 0)
      : toMaxPrecision(this.data.amount / 100000000, 6)
  },

  get units () {
    return this.data.issuanceType
      ? (this.data.issuanceType === 'common_shares' ? 'Shares' : 'Units')
      : this.data.currencyType
  }
})

Notification.List = DefineList.extend('NotificationList', {
  '#': Notification
})

Notification.connection = superModelNoCache({
  Map: Notification,
  List: Notification.List,
  feathersService: feathersClient.service('/notifications'),
  name: 'notifications',
  algebra
})

Notification.algebra = algebra

export default Notification
