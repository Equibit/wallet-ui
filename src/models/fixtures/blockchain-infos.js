import fixture from 'can-fixture'
import BlockchainInfo from '~/models/blockchain-info'

const data = [{
  '_id': '5aba92a302fb78d9a969bd92',
  'coinType': 'EQB',
  'status': true,
  'mode': 'regtest',
  'createdAt': '2018-03-27T18:51:15.690Z',
  'updatedAt': '2018-06-12T17:09:38.125Z',
  '__v': 0,
  'difficulty': 4.656542373906925e-10,
  'bestblockhash': '27d2c933241be9cdf814c981f649e49b56d472fc1b83a1be80c6f4946ea64e11',
  'currentBlockHeight': 101,
  'errorMessage': '',
  'mediantime': 1527626168,
  'feeRates': {
    'priority': 20,
    'regular': 5
  },
  'sha': 'sha3_256'
}, {
  '_id': '5aba92a302fb78d9a969bd93',
  'coinType': 'BTC',
  'status': true,
  'mode': 'regtest',
  'createdAt': '2018-03-27T18:51:15.691Z',
  'updatedAt': '2018-06-11T11:59:24.037Z',
  '__v': 0,
  'difficulty': 4.656542373906925e-10,
  'bestblockhash': '000db3d76340bab8af06bf6b9a88c1f30abbc270846041422b2c62d4a1e37281',
  'currentBlockHeight': 22830,
  'errorMessage': '',
  'mediantime': 1528228013,
  'feeRates': {
    'priority': 20,
    'regular': 5
  }
}]
const store = fixture.store(data, BlockchainInfo.connection.algebra)

fixture('/blockchain-info/{_id}', store)

export default store

export { data }
