import fixture from 'can-fixture'
import _ from 'lodash'

const data = _.times(8, i => {
  return {
    _id: i,
    companyName: [
      'Imperial Brands', 'Microsoft', 'Amazon', 'Bershire', 'Facebook', 'Johnson & Johnson', 'Alphabet', 'Exxon Mobil'
    ][i % 8],
    price: [210, 270, 230, 200, 150, 120, 110, 105][i % 8]
  }
})

fixture('GET /market-cap', function () {
  return data
})

export { data }
