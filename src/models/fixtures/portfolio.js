import fixture from 'can-fixture'
import { addressesMeta } from '../mock/mock-portfolio'

fixture('GET /portfolios', function () {
  return [{
    _id: '59381d42f44574ec6f2bcb6d',
    name: 'My Portfolio',
    userId: '593813edf44574ec6f2bcb57',
    index: 0,
    updatedAt: '2017-06-12T04:31:43.546Z',
    createdAt: '2017-06-07T15:35:30.328Z',
    isBalanceCalculating: true,
    addressesMeta
  }]
})

fixture('PATCH /portfolios/{id}', function (params) {
  return (params && params.data) || {}
})
