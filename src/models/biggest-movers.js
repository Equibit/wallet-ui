/**
 * @module {can-map} models/biggest-movers BiggestMovers
 * @parent models
 *
 * Biggest Movers - grid on the Research page
 *
 * @group models/biggest-movers.properties 0 properties
 */
import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'

// TODO: remove FIXTURES:
import { data } from './fixtures/biggest-movers'

const BiggestMovers = DefineMap.extend('BiggestMovers', {
  _id: 'string',
  companyName: 'string',
  change: 'number',
  changePercent: 'number',
  /**
   * @property {String} issuanceId
   * @parent models/biggest-movers.properties
   * Id of the most popular issuance of the company
   */
  issuanceId: 'string'
})

BiggestMovers.List = DefineList.extend('BiggestMovers', {
  '#': BiggestMovers
})

BiggestMovers.connection = superModel({
  Map: BiggestMovers,
  List: BiggestMovers.List,
  feathersService: feathersClient.service('/biggest-movers'),
  name: 'biggest-movers',
  algebra
})

BiggestMovers.algebra = algebra

// todo: remove this FIXTURE:
BiggestMovers.getList = (params) => {
  const sort = params && params['$sort'] && params['$sort'].change === '1' ? (a, b) => (a.change - b.change) : (a, b) => (b.change - a.change)
  return Promise.resolve(new BiggestMovers.List(data.sort(sort)))
}

export default BiggestMovers
