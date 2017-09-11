import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'

const Issuance = DefineMap.extend('Issuance', {
  _id: 'string',
  companyId: 'string',
  companyName: 'string',
  companySlug: 'string',
  domicile: 'string',
  issuanceName: 'string',
  issuanceType: 'string',
  restriction: 'string',
  marketCap: 'number',
  change: 'number',
  changePercentage: 'number',

  // 24h stat data:
  highestBid: 'number',
  lowestAsk: 'number',
  highestNumShares: 'number',
  lowestNumShares: 'number',

  // meta data:
  volume24h: 'number',
  sharesAuthorized: 'number',
  sharesIssued: 'number',
  sharesDividend: 'number',
  sharesDividendYield: 'number',

  tradesNum: 'number',

  // ENUM ('Common Shares' | '')
  type: 'string',

  /**
   * Id of the user who created the issuance
   */
  userId: 'string',

  // extras:
  selected: {
    type: 'boolean',
    serialize: false
  },
  // helper prop for selected item of the dropdown list of Issuance.types
  issuanceTypeItem: {
    type: '*',
    serialize: false
  }
})

Issuance.types = new DefineList([
  { name: 'Common Shares' },
  { name: 'Preferred Shares' },
  { name: 'Trust Units' },
  { name: 'Partnership Units' },
  { name: 'Bonds' },
])

Issuance.List = DefineList.extend('IssuanceList', {
  '#': Issuance
})

Issuance.connection = superModel({
  Map: Issuance,
  List: Issuance.List,
  feathersService: feathersClient.service('/issuances'),
  name: 'issuances',
  algebra
})

Issuance.algebra = algebra

export default Issuance
