import fixture from 'can-fixture'
import Company from '~/models/company'
import { times } from 'ramda'

const companies = [
  'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
  'Propanc Health', 'Marks And Spencer', 'Cool Technologies', 'The Pulse Beverages'
]
const store = fixture.store(times(function (i) {
  return {
    _id: i,
    userId: 0,
    companyName: companies[i % 9],
    companySlug: companies[i % 9].toLowerCase().split(' ').join('-'),
    domicile: ['USA', 'UK', 'Poland', 'Sweden', 'France'][i % 5],

    streetAddress: '152 Main St.',
    streetAddress2: 'Suite 102',
    city: 'Petrozavodsk',
    state: 'NY',
    postalCode: '12065',

    website: 'imperialbrands.com',
    contactEmail: 'info@imperialbrands.com',
    phoneNumber: '1-800-768-378'
  }
}, 9), Company.connection.algebra)

fixture('/companies/{_id}', store)

export default store
