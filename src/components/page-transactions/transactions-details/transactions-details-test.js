import assert from 'chai/chai'
import 'steal-mocha'
import { ViewModel } from './transactions-details'
import Portfolio from '../../../models/portfolio'
import portfolio from '../../../models/mock/mock-portfolio'

describe('components/page-transactions/transactions-details', function () {
  const portfolios = new Portfolio.List([portfolio])
  const transaction = {
    type: 'IN',
    address: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA',
    fromAddress: 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA',
    toAddress: 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
  }
  var vm = new ViewModel({
    portfolios,
    transaction
  })
  it('should define `to`', function () {
    assert.equal(vm.to, 'My Portfolio')
  })
  it('should define `from`', function () {
    assert.equal(vm.from, 'mnLAGnJbVbneE8uxVNwR7p79Gt81JkrctA')
  })
})
