import fixture from 'can-fixture'
import BiggestMovers from '~/models/biggest-movers'
import _ from 'lodash'

const companies = [
  'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
  'Propanc Health', 'Marks And Spencer', 'Cool Technologies', 'The Pulse Beverages'
]
const data = _.times(50, function (i) {
  const r = Math.floor(Math.random() * 1000)
  return {
    _id: i,
    companyName: companies[i % 9] + ' - ' + i,
    companySlug: companies[i % 9].toLowerCase().split(' ').join('-'),
    domicile: ['USA', 'UK', 'Poland', 'Sweden', 'France'][i % 5],
    change: [r, -r, r * 2][r % 3],
    changePercent: [r / 10, -r / 10, r / 15][r % 3]
  }
})
const store = fixture.store(data, BiggestMovers.connection.algebra)

fixture('/biggest-movers/{_id}', store)

export default store
export { data }
