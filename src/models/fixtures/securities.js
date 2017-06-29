import fixture from 'can-fixture'
import PortfolioSecurity from '~/models/portfolio-security'
import _ from 'lodash'

const companies = [
  'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
  'Propanc Health', 'Marks And Spencer', 'Cool Technologies', 'The Pulse Beverages'
]
const store = fixture.store(_.times(50, function (i) {
  return {
    _id: i,
    companyName: companies[i % 9],
    companySlug: companies[i % 9].toLowerCase().split(' ').join('-'),
    issuanceName: ['Series 1', 'Series 2'][i % 2],
    securityType: ['equity', 'bond'][i % 2],   // ENUM ('equity', 'bond')
    quantity: Math.floor(Math.random() * 100),
    cost: Math.random() * 100,
    price: Math.random() * 100,
    value: Math.random() * 100,
    profitLoss: (Math.random() * 100 * [1, -1, 1][i % 3])
  }
}), PortfolioSecurity.connection.algebra)

fixture('/portfolio-securities/{_id}', store)

export default store
