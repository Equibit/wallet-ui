import fixture from 'can-fixture'

const data = {
  newIssuances: 420,
  volume: 34058,
  tradesNum: 4931,
  shareVolume: 63 * 1000
}

fixture('GET /market', function () {
  return data
})

export { data }
