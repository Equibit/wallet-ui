import fixture from 'can-fixture'
import Issuance from '~/models/issuance'
import _ from 'lodash'

const companies = [
  'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
  'Propanc Health', 'Marks And Spencer', 'Cool Technologies', 'The Pulse Beverages'
]
const data = _.times(90, function (i) {
  return {
    _id: i,
    companyName: companies[i % 9],
    companySlug: companies[i % 9].toLowerCase().split(' ').join('-'),
    domicile: ['USA', 'UK', 'Poland', 'Sweden', 'France'][i % 5],
    issuanceName: ['Series 1', 'Series 2'][i % 2],
    issuanceType: ['common_shares', 'trust_units', 'preferred_shares'][i % 3],
    restriction: ['1', '2', 'None'][i % 3],
    marketCap: [285123700, 285123700, 285123700][i % 3],
    change: [502, -601, 120, -120][i % 4],
    changePercentage: [0.74, 0.56, 0.45][i % 3],

    highestBid: [100000, 120000, 130000][i % 3],
    lowestAsk: [90000, 93000, 125000][i % 3],
    highestNumShares: [1000, 1100, 1200][i % 3],
    lowestNumShares: [800, 900, 950][i % 3],

    volume24h: 1541,
    sharesAuthorized: 10000,
    sharesIssued: 8459,
    sharesDividend: 764,
    sharesDividendYield: 2.6,

    tradesNum: [40, 25, 54, 300][i % 4]
  }
})
const store = fixture.store(data, Issuance.connection.algebra)

fixture('/issuances/{_id}', store)

export default store

export { data }

export { companies }
