import fixture from 'can-fixture'
import { times } from 'ramda'
import Order from '../order'
import issuance from '../mock/mock-issuance'
import { companies } from '../fixtures/issuances'

const data = times(i => {
  return {
    _id: '' + i,
    issuanceAddress: issuance.address,
    quantity: (1000 * (i + 1)),
    price: 70 * (i + 1),
    createdAt: [(new Date()).toJSON(), '2017-04-12T04:35:34.835Z', '2017-03-05T08:45:34.835Z'][i % 3],
    isFillOrKill: [true, false, false][i % 3],
    type: ['SELL', 'BUY', 'SELL'][i % 3],
    status: ['OPEN', 'TRADING', 'CANCELLED', 'CLOSED'][i % 4],

    companyName: companies[i % 9],
    issuanceName: ['Series 1', 'Series 2'][i % 2],
    issuanceType: ['common_shares', 'trust_units', 'preferred_shares'][i % 3]
  }
}, 50)

const store = fixture.store(data, Order.algebra)

fixture('/orders/{_id}', store)

export default data
