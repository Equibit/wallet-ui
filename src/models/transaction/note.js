import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from '../feathers-client'
import { superModelNoCache } from '../super-model'
import algebra from '../algebra'

const TransactionNote = DefineMap.extend('TransactionNote', {
  _id: 'string',
  address: 'string',
  description: 'string',
  txId: 'string'
})

TransactionNote.List = DefineList.extend('TransactionNoteList', {
  '#': TransactionNote
})

TransactionNote.connection = superModelNoCache({
  Map: TransactionNote,
  List: TransactionNote.List,
  feathersService: feathersClient.service('/transaction-notes'),
  name: 'TransactionNotes',
  algebra
})

TransactionNote.algebra = algebra

export default TransactionNote
