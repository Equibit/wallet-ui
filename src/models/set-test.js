import assert from 'chai/chai'
import 'steal-mocha'
import canSet from 'can-set'

describe('Pagination can-set algebra', function () {
  const algebra = new canSet.Algebra(
    canSet.comparators.id('_id'),
    canSet.props.offsetLimit('$skip', '$limit')
  )
  const set = { $limit: 5, $skip: 0 }
  const props = { _id: '595e5c58711b9e358f567edc', name: 'My Portfolio' }

  const has = algebra.has(set, props)

  assert.ok(has)
})
