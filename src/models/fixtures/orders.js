import fixture from 'can-fixture'
import { times } from 'ramda'
import Order from '../order'
import issuance from '../mock/mock-issuance'

const data = times((i) => {
  return {
    _id: i,
    issuanceAddress: issuance.address,
    quantity: (1000 * (i + 1)),
    price: 70 * (i + 1),
    date: [(new Date()).toJSON(), '2017-04-12T04:35:34.835Z', '2017-03-05T08:45:34.835Z'][i % 3],
    partial: [true, false, true][i % 3],
    type: ['SELL', 'BUY'][i % 2]
  }
}, 50)

const store = fixture.store(data, Order.algebra)

fixture('/orders/{_id}', store)

export default data
