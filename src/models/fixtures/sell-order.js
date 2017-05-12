import fixture from 'can-fixture';
import _ from 'lodash';
import SellOrder from '~/models/sell-order';

let store = fixture.store(_.times(50, (i) => {
  return {
    _id: i,
    quantity: 100 * i,
    price: 70 * i,
    date: [(new Date).toJSON(), '2017-04-12T04:35:34.835Z', '2017-03-05T08:45:34.835Z'][i%3],
    partial: [true, false][i % 2]
  };
}), SellOrder.algebra);

fixture('/sell-order/{_id}', store);
fixture('/buy-order/{_id}', store);
