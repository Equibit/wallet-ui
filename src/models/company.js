import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'

const Company = DefineMap.extend('Company', {
  _id: 'string',
  userId: 'string',

  companyName: 'string',
  companySlug: 'string',
  domicile: 'string',

  streetAddress: 'string',
  streetAddress2: 'string',
  city: 'string',
  state: 'string',
  postalCode: 'string',

  contactEmail: 'string',
  website: 'string',
  phoneNumber: 'string'
})

Company.List = DefineList.extend('CompanyList', {
  '#': Company
})

Company.connection = superModel({
  Map: Company,
  List: Company.List,
  feathersService: feathersClient.service('/companies'),
  name: 'companies',
  algebra
})

Company.algebra = algebra

export default Company
