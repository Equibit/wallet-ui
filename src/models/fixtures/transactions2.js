import fixture from 'can-fixture'
import data from './transactions.json'

fixture('get /transactions', function () {
  return data.data
})
