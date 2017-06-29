/**
 * @module {can-map} models/PortfolioSecurity PortfolioSecurity
 * @parent models
 *
 * Portfolio Security model
 *
 * @group models/PortfolioSecurity.properties 0 properties
 */

import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'

const PortfolioSecurity = DefineMap.extend('PortfolioSecurity', {
  _id: 'string',
  companyId: 'string',
  companyName: 'string',
  companySlug: 'string',
  issuanceName: 'string',
  securityType: 'string',   // ENUM ('equity', 'bond')
  quantity: 'number',
  cost: 'number',
  price: 'number',
  value: 'number',
  profitLoss: 'number'
})

PortfolioSecurity.List = DefineList.extend('PortfolioSecurityList', {
  '#': PortfolioSecurity
})

PortfolioSecurity.connection = superModel({
  Map: PortfolioSecurity,
  List: PortfolioSecurity.List,
  feathersService: feathersClient.service('/portfolio-securities'),
  name: 'portfoliosecurities',
  algebra
})

PortfolioSecurity.algebra = algebra

export default PortfolioSecurity
