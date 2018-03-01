import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import superModel from './super-model'
import algebra from './algebra'

// Regular BTC transaction with 1 input and 2 outputs:
// 0100000001545f6161d2be3bdfe7184ee1f72123c3918738da8b97f11e23acdd34059f7a2d010000006b4830450221008c33d765ae16cfa3cc653
// c5c039d58131fbbdf76266af7a76910fc1ba39de0b8022048ae83fc9b82f62b816641158dd1cfd398d2c56d5f6f812c9fa588947311d840012103
// 3701fc7f242ae2dd63a18753518b6d1425e53496878924b6c0dc08d800af46adffffffff0200e1f505000000001976a91461ca8116d03694952a3
// ad252d53c695da7d95f6188ac18ddf505000000001976a9145e9f5c8cc17ecaaea1b4e5a3d091ca0aed1342f788ac00000000
// Length of hex: 452 chars
// In bytes: 452 / 2 = 226

// https://bitcoinfees.earn.com/api
const TransactionFee = DefineMap.extend('TransactionFee', {
  _id: 'string',
  // Currency type: btcFee | eqbFee
  currencyType: 'string',

  // Satoshi / byte
  priority: 'number',

  regular: 'number',

  calculateFee (txHex, type = 'regular') {
    if (!this.regular && !this.priority) {
      throw new Error({message: 'No fee rates defined'})
    }
    const rate = type === 'regular' ? this.regular : this.priority
    return (txHex.length / 2) * rate
  }
})

TransactionFee.List = DefineList.extend('TransactionFeeList', {
  '#': TransactionFee
})

TransactionFee.connection = superModel({
  Map: TransactionFee,
  List: TransactionFee.List,
  feathersService: feathersClient.service('/transaction-fee'),
  name: 'transactionfee',
  algebra
})

TransactionFee.algebra = algebra

export default TransactionFee
